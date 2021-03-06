#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#include <napi.h>

/***** HELPERS *****/

// Converts a CGError to a human-readable string.
std::string CGErrorToString(CGError err) {
  if (err == kCGErrorCannotComplete) {
    return "The requested operation is inappropriate for the parameters passed "
           "in, or the current system state";
  } else if (err == kCGErrorFailure) {
    return "A general failure occurred";
  } else if (err == kCGErrorIllegalArgument) {
    return "One or more of the parameters passed to a function are invalid";
  } else if (err == kCGErrorInvalidConnection) {
    return "The parameter representing a connection to the window server is "
           "invalid";
  } else if (err == kCGErrorInvalidContext) {
    return "The CPSProcessSerNum or context identifier parameter is not valid";
  } else if (err == kCGErrorInvalidOperation) {
    return "The requested operation is not valid for the parameters passed in, "
           "or the current system state.";
  } else if (err == kCGErrorNoneAvailable) {
    return "The requested operation could not be completed as the indicated "
           "resources were not found";
  } else if (err == kCGErrorNotImplemented) {
    return "Return value from obsolete function stubs present for binary "
           "compatibility, but not typically called";
  } else if (err == kCGErrorRangeCheck) {
    return "A parameter passed in has a value that is inappropriate, or which "
           "does not map to a useful operation or value";
  } else if (err == kCGErrorTypeCheck) {
    return "A data type or token was encountered that did not match the "
           "expected type or token";
  } else {
    return "Unknown display configuration error";
  }
}

// Converts a simple C array to a Napi::Array.
template <typename T> Napi::Array CArrayToNapiArray(Napi::Env env, T *c_arr) {
  Napi::Array arr = Napi::Array::New(env, sizeof c_arr);

  for (size_t i = 0; i < sizeof c_arr; i++) {
    arr[i] = static_cast<int>(c_arr[i]);
  }

  return arr;
}

// Converts an NSRect to an object representing bounds.
Napi::Object NSRectToBoundsObject(Napi::Env env, const NSRect &rect) {
  Napi::Object obj = Napi::Object::New(env);

  CGFloat primary_display_height =
      NSMaxY([[[NSScreen screens] firstObject] frame]);

  obj.Set("x", rect.origin.x);
  obj.Set("y", primary_display_height - rect.origin.y - rect.size.height);
  obj.Set("width", rect.size.width);
  obj.Set("height", rect.size.height);

  return obj;
}

// Converts a bounds object to an NSRect.
NSRect BoundsObjectToNSRect(Napi::Object bounds) {
  int64_t x = bounds.Get("x").As<Napi::Number>().Int64Value();
  int64_t y = bounds.Get("y").As<Napi::Number>().Int64Value();
  int64_t width = bounds.Get("width").As<Napi::Number>().Int64Value();
  int64_t height = bounds.Get("height").As<Napi::Number>().Int64Value();

  return NSMakeRect((CGFloat)x, (CGFloat)y, (CGFloat)width, (CGFloat)height);
}

// Converts an NSColorSpace to an object containing information about the
// colorSpace.
Napi::Object NSColorSpaceToObject(Napi::Env env, NSColorSpace *color_space) {
  Napi::Object obj = Napi::Object::New(env);

  obj.Set("name", std::string([[color_space localizedName] UTF8String]));
  obj.Set("componentCount", [color_space numberOfColorComponents]);

  return obj;
}

// Returns the NSScreen correspondent to a specified display id.
NSScreen *ScreenForID(uint32_t display_id) {
  NSArray<NSScreen *> *screens = [NSScreen screens];

  size_t num_displays = [screens count];
  for (size_t i = 0; i < num_displays; i++) {
    NSScreen *screen = [screens objectAtIndex:i];
    CGDirectDisplayID s_id = [[[screen deviceDescription]
        objectForKey:@"NSScreenNumber"] unsignedIntValue];
    if (s_id == display_id) {
      return screen;
    }
  }

  return nullptr;
}

// Returns whether or not the display is monochrome.
bool GetIsMonochrome() {
  CFStringRef app = CFSTR("com.apple.CoreGraphics");
  CFStringRef key = CFSTR("DisplayUseForcedGray");
  Boolean key_valid = false;

  return CFPreferencesGetAppBooleanValue(key, app, &key_valid) ? true : false;
}

// Creates an object containing all properties of an display.
Napi::Object BuildDisplay(Napi::Env env, NSScreen *nsscreen) {
  Napi::Object display = Napi::Object::New(env);

  CGDirectDisplayID display_id = [[[nsscreen deviceDescription]
      objectForKey:@"NSScreenNumber"] unsignedIntValue];
  display.Set("id", display_id);

  if (@available(macOS 10.15, *)) {
    display.Set("name", std::string([[nsscreen localizedName] UTF8String]));
  }

  CGDisplayModeRef display_mode = CGDisplayCopyDisplayMode(display_id);
  display.Set("refreshRate", CGDisplayModeGetRefreshRate(display_mode));

  display.Set("supportedWindowDepths",
              CArrayToNapiArray(env, [nsscreen supportedWindowDepths]));
  display.Set("isAsleep", CGDisplayIsAsleep(display_id) ? true : false);
  display.Set("isMonochrome", GetIsMonochrome());
  display.Set("colorSpace", NSColorSpaceToObject(env, [nsscreen colorSpace]));
  display.Set("depth", static_cast<int>([nsscreen depth]));
  display.Set("scaleFactor", [nsscreen backingScaleFactor]);
  display.Set("bounds", NSRectToBoundsObject(env, [nsscreen frame]));
  display.Set("workArea", NSRectToBoundsObject(env, [nsscreen visibleFrame]));
  display.Set("rotation", static_cast<int>(CGDisplayRotation(display_id)));
  display.Set("internal", CGDisplayIsBuiltin(display_id) ? true : false);

  return display;
}

/***** EXPORTED FUNCTIONS *****/

// Returns an array of all system displays.
Napi::Array GetAllDisplays(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();
  NSArray<NSScreen *> *nsscreens = [NSScreen screens];
  size_t num_displays = [nsscreens count];

  Napi::Array displays = Napi::Array::New(env, num_displays);
  for (size_t i = 0; i < num_displays; i++) {
    displays[i] = BuildDisplay(env, [nsscreens objectAtIndex:i]);
  }

  return displays;
}

// Takes a screenshot of the specified display.
Napi::Buffer<uint8_t> Screenshot(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  uint32_t display_id = info[0].As<Napi::Number>().Uint32Value();
  Napi::Object options = info[1].As<Napi::Object>();

  NSBitmapImageFileType image_type = NSBitmapImageFileTypeJPEG;
  if (options.Has("type")) {
    std::string type = options.Get("type").As<Napi::String>().Utf8Value();
    if (type == "png") {
      image_type = NSBitmapImageFileTypePNG;
    } else if (type == "tiff") {
      image_type = NSBitmapImageFileTypeTIFF;
    }
  }

  CGImageRef img_ref;
  if (options.Has("bounds")) {
    Napi::Object bounds = options.Get("bounds").As<Napi::Object>();
    CGRect rect = NSRectToCGRect(BoundsObjectToNSRect(bounds));
    img_ref = CGDisplayCreateImageForRect(display_id, rect);
  } else {
    img_ref = CGDisplayCreateImage(display_id);
  }

  if (!img_ref)
    return Napi::Buffer<uint8_t>::New(env, 0);

  std::vector<uint8_t> data;

  NSBitmapImageRep *bitmap_rep =
      [[NSBitmapImageRep alloc] initWithCGImage:img_ref];
  NSData *image_data = [bitmap_rep representationUsingType:image_type
                                                properties:@{}];
  const uint8 *bytes = (uint8 *)[image_data bytes];
  data.assign(bytes, bytes + [image_data length]);

  if (data.empty())
    return Napi::Buffer<uint8_t>::New(env, 0);

  return Napi::Buffer<uint8_t>::Copy(env, &data[0], data.size());
}

// Returns the display object containing the window with the keyboard focus.
Napi::Object GetPrimaryDisplay(const Napi::CallbackInfo &info) {
  return BuildDisplay(info.Env(), [NSScreen mainScreen]);
}

// Returns the display object with the specified display id.
Napi::Object GetDisplayFromID(const Napi::CallbackInfo &info) {
  uint32_t display_id = info[0].As<Napi::Number>().Uint32Value();

  NSArray<NSScreen *> *screens = [NSScreen screens];

  size_t num_displays = [screens count];
  for (size_t i = 0; i < num_displays; i++) {
    NSScreen *screen = [screens objectAtIndex:i];
    CGDirectDisplayID s_id = [[[screen deviceDescription]
        objectForKey:@"NSScreenNumber"] unsignedIntValue];
    if (s_id == display_id) {
      return BuildDisplay(info.Env(), screen);
    }
  }

  return Napi::Object();
}

// Configure two macOS system displays to mirror status.
void Mirror(const Napi::CallbackInfo &info) {
  bool enable = info[0].As<Napi::Boolean>().Value();

  uint32_t primary_display_id;
  uint32_t secondary_display_id;
  if (info.Length() == 3) {
    primary_display_id = info[1].As<Napi::Number>().Uint32Value();
    secondary_display_id = info[2].As<Napi::Number>().Uint32Value();
  } else {
    primary_display_id = CGMainDisplayID();
    secondary_display_id = info[1].As<Napi::Number>().Uint32Value();
  }

  CGDisplayConfigRef config_ref;
  CGError err = CGBeginDisplayConfiguration(&config_ref);
  if (err != 0) {
    Napi::Error::New(info.Env(), CGErrorToString(err))
        .ThrowAsJavaScriptException();
    return;
  }

  err = CGConfigureDisplayMirrorOfDisplay(config_ref, secondary_display_id,
                                          enable ? primary_display_id
                                                 : kCGNullDirectDisplay);
  if (err != 0) {
    Napi::Error::New(info.Env(), CGErrorToString(err))
        .ThrowAsJavaScriptException();
    return;
  }

  err = CGCompleteDisplayConfiguration(config_ref, kCGConfigurePermanently);
  if (err != 0) {
    Napi::Error::New(info.Env(), CGErrorToString(err))
        .ThrowAsJavaScriptException();
    return;
  }
}

// Initializes all functions exposed to JS.
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "getAllDisplays"),
              Napi::Function::New(env, GetAllDisplays));
  exports.Set(Napi::String::New(env, "getPrimaryDisplay"),
              Napi::Function::New(env, GetPrimaryDisplay));
  exports.Set(Napi::String::New(env, "getDisplayFromID"),
              Napi::Function::New(env, GetDisplayFromID));
  exports.Set(Napi::String::New(env, "mirror"),
              Napi::Function::New(env, Mirror));
  exports.Set(Napi::String::New(env, "screenshot"),
              Napi::Function::New(env, Screenshot));

  return exports;
}

NODE_API_MODULE(displays, Init)
