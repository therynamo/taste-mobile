package app

import android.os.VibrationEffect
import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.spring
import androidx.compose.animation.core.tween
import androidx.compose.animation.scaleIn

fun buzz(v: android.os.Vibrator) {
    v.vibrate(VibrationEffect.createOneShot(40, 255))
}

val bouncy = spring<Float>(dampingRatio = Spring.DampingRatioHighBouncy)
val slow = tween<Float>(durationMillis = 900)
val enter = scaleIn()
