#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#include <napi.h>

/***** HELPERS *****/

template <typename T> Napi::Array CArrayToNapiArray(Napi::Env env, T *c_arr) {
  Napi::Array arr = Napi::Array::New(env, sizeof c_arr);

  for (size_t i = 0; i < sizeof c_arr; i++) {
    arr[i] = static_cast<int>(c_arr[i]);
  }

  return arr;
}

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

// Creates an object containing all properties of an NSScreen.
Napi::Object BuildDisplay(Napi::Env env, NSScreen *nsscreen) {
  Napi::Object display = Napi::Object::New(env);

  CGDirectDisplayID display_id = [[[nsscreen deviceDescription]
      objectForKey:@"NSScreenNumber"] unsignedIntValue];
  display.Set("id", display_id);

  if (@available(macOS 10.15, *)) {
    display.Set("name", std::string([[nsscreen localizedName] UTF8String]));
  }

  CFStringRef app = CFSTR("com.apple.CoreGraphics");
  CFStringRef key = CFSTR("DisplayUseForcedGray");
  Boolean key_valid = false;
  bool monochrome =
      CFPreferencesGetAppBooleanValue(key, app, &key_valid) ? true : false;
  display.Set("isMonochrome", monochrome);

  Napi::Array window_depths =
      CArrayToNapiArray(env, [nsscreen supportedWindowDepths]);
  display.Set("supportedWindowDepths", window_depths);

  display.Set("depth", static_cast<int>([nsscreen depth]));
  display.Set("scaleFactor", [nsscreen backingScaleFactor]);
  display.Set("bounds", NSRectToBoundsObject(env, [nsscreen frame]));
  display.Set("workArea", NSRectToBoundsObject(env, [nsscreen visibleFrame]));
  display.Set("rotation", static_cast<int>(CGDisplayRotation(display_id)));
  display.Set("internal", CGDisplayIsBuiltin(display_id) ? true : false);

  return display;
}

/***** EXPORTED FUNCTIONS *****/

Napi::Array GetAllDisplays(const Napi::CallbackInfo &info) {
  NSArray<NSScreen *> *nsscreens = [NSScreen screens];
  size_t num_displays = [nsscreens count];

  Napi::Array displays = Napi::Array::New(info.Env(), num_displays);
  for (size_t i = 0; i < num_displays; i++) {
    displays[i] = BuildDisplay(info.Env(), [nsscreens objectAtIndex:i]);
  }

  return displays;
}

// Returns the display object containing the window with the keyboard focus.
Napi::Object GetPrimaryDisplay(const Napi::CallbackInfo &info) {
  return BuildDisplay(info.Env(), [NSScreen mainScreen]);
}

// Returns the display object with the specified display id.
Napi::Object GetDisplayFromID(const Napi::CallbackInfo &info) {
  Napi::Env env = info.Env();

  uint32_t display_id = info[0].As<Napi::Number>().Uint32Value();
  NSArray<NSScreen *> *screens = [NSScreen screens];

  size_t num_displays = [screens count];
  for (size_t i = 0; i < num_displays; i++) {
    NSScreen *screen = [screens objectAtIndex:i];
    CGDirectDisplayID s_id = [[[screen deviceDescription]
        objectForKey:@"NSScreenNumber"] unsignedIntValue];
    if (s_id == display_id) {
      return BuildDisplay(env, screen);
    }
  }

  return Napi::Object();
}

// Initializes all functions exposed to JS.
Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "getAllDisplays"),
              Napi::Function::New(env, GetAllDisplays));
  exports.Set(Napi::String::New(env, "getPrimaryDisplay"),
              Napi::Function::New(env, GetPrimaryDisplay));
  exports.Set(Napi::String::New(env, "getDisplayFromID"),
              Napi::Function::New(env, GetDisplayFromID));

  return exports;
}

NODE_API_MODULE(displays, Init)
