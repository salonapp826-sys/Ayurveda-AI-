package com.nexora.salon.data.analytics

import android.content.Context
import android.util.Log

object AnalyticsManager {
    private const val TAG = "NexoraAnalytics"
    private var isConsentGranted: Boolean = true

    fun initialize(context: Context) {
        val prefs = context.getSharedPreferences("nexora_prefs", Context.MODE_PRIVATE)
        isConsentGranted = prefs.getBoolean("analytics_consent", true)
        Log.d(TAG, "Analytics initialized. Consent status: $isConsentGranted")
    }

    fun setConsent(context: Context, granted: Boolean) {
        isConsentGranted = granted
        val prefs = context.getSharedPreferences("nexora_prefs", Context.MODE_PRIVATE)
        prefs.edit().putBoolean("analytics_consent", granted).apply()
        Log.d(TAG, "User updated analytics consent: $granted")
    }

    fun logEvent(eventName: String, params: Map<String, Any> = emptyMap()) {
        if (!isConsentGranted) {
            // Respect privacy when consent is revoked
            return
        }
        Log.i(TAG, "Event logged: $eventName | params: $params")
    }

    fun logNonFatalCrash(throwable: Throwable, reason: String) {
        if (!isConsentGranted) return
        Log.e(TAG, "Reported crash issue: $reason", throwable)
    }
}
