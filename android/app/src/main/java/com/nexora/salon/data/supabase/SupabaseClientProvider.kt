package com.nexora.salon.data.supabase

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.auth.auth
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.storage.storage
import io.github.jan.supabase.postgrest.Postgrest
import io.github.jan.supabase.postgrest.postgrest

object SupabaseClientProvider {
    private var client: SupabaseClient? = null

    fun initialize(supabaseUrl: String, supabaseKey: String) {
        client = createSupabaseClient(
            supabaseUrl = supabaseUrl,
            supabaseKey = supabaseKey
        ) {
            install(Auth)
            install(Storage)
            install(Postgrest)
        }
    }

    val supabase: SupabaseClient
        get() = client ?: error("SupabaseClientProvider has not been initialized in Application.onCreate")

    val auth: Auth
        get() = supabase.auth

    val storage: Storage
        get() = supabase.storage

    val postgrest: Postgrest
        get() = supabase.postgrest
}
