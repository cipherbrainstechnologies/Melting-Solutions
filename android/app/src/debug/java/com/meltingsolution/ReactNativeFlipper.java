/**
 * Flipper disabled for local builds — Flipper 0.54 / Fresco 2.2 artifacts are no longer
 * resolvable from Maven Central after JCenter shutdown.
 */
package com.meltingsolution;

import android.content.Context;
import com.facebook.react.ReactInstanceManager;

public class ReactNativeFlipper {
  public static void initializeFlipper(Context context, ReactInstanceManager reactInstanceManager) {
    // no-op
  }
}
