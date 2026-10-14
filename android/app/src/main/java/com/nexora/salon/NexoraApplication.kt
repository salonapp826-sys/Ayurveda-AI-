package com.nexora.salon

import android.app.Application
import com.nexora.salon.data.analytics.AnalyticsManager
import com.nexora.salon.data.supabase.SupabaseClientProvider

class NexoraApplication : Application() {

    override fun onCreate() {
        super.onCreate()
        // Initialize Supabase Client (Auth + Storage)
        SupabaseClientProvider.initialize(
            supabaseUrl = BuildConfig.SUPABASE_URL,
            supabaseKey = BuildConfig.SUPABASE_ANON_KEY
        )

        // Initialize Consent-governed Analytics & Crash Monitoring
        AnalyticsManager.initialize(this)
    }
}
