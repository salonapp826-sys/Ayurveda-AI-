import React, { useState } from 'react';
import { X, Smartphone, Layers, ShieldCheck, Database, Bell, Check, Copy, Code2 } from 'lucide-react';

interface AndroidAppInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AndroidAppInspectorModal: React.FC<AndroidAppInspectorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFile, setSelectedFile] = useState<string>('MainActivity.kt');
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const filesMap: Record<string, { desc: string; code: string }> = {
    'MainActivity.kt': {
      desc: 'Entry point initializing Jetpack Compose, Material 3 Theme, NavHost, and ViewModels',
      code: `package com.nexora.salon

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.navigation.compose.rememberNavController
import com.nexora.salon.ui.navigation.NexoraNavGraph
import com.nexora.salon.ui.theme.NexoraSalonTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NexoraSalonTheme {
                val navController = rememberNavController()
                NexoraNavGraph(navController = navController)
            }
        }
    }
}`
    },
    'SupabaseClientProvider.kt': {
      desc: 'Configures Supabase GoTrue Auth, Storage bucket for profile photos, and Postgrest',
      code: `package com.nexora.salon.data.supabase

import io.github.jan.supabase.SupabaseClient
import io.github.jan.supabase.createSupabaseClient
import io.github.jan.supabase.auth.Auth
import io.github.jan.supabase.storage.Storage
import io.github.jan.supabase.postgrest.Postgrest

object SupabaseClientProvider {
    fun initialize(supabaseUrl: String, supabaseKey: String) {
        client = createSupabaseClient(supabaseUrl, supabaseKey) {
            install(Auth)
            install(Storage)
            install(Postgrest)
        }
    }
}`
    },
    'Repositories.kt': {
      desc: 'Clean Repository pattern for Auth, Supabase Storage, and Salon Booking services',
      code: `package com.nexora.salon.data.repository

interface AuthRepository {
    val currentUserProfile: Flow<UserProfile?>
    suspend fun signInWithEmail(email: String, password: String): Result<UserProfile>
    suspend fun signUpWithEmail(name: String, email: String, password: String, phone: String?): Result<UserProfile>
    suspend fun signOut(): Result<Unit>
}

interface StorageRepository {
    suspend fun uploadProfilePhoto(userId: String, byteArray: ByteArray, mimeType: String): Result<String>
}`
    },
    'WhatsAppFloatingActionButton.kt': {
      desc: 'Jetpack Compose Floating Action Button connecting directly to WhatsApp (+91 98201 45890)',
      code: `package com.nexora.salon.ui.components

@Composable
fun WhatsAppFloatingActionButton(
    phoneNumber: String = "+919820145890",
    defaultMessage: String = "Namaste Nexora! Mujhe salon appointment book karni hai."
) {
    ExtendedFloatingActionButton(
        onClick = { openWhatsAppChat(context, phoneNumber, defaultMessage) },
        containerColor = NexoraWhatsApp,
        text = { Text("WhatsApp Us") }
    )
}`
    },
    'ProfileScreen.kt': {
      desc: 'User Profile screen in Compose with Supabase Auth, Storage upload, and Loyalty Points section (10% cashback on total bookings + discount redemption)',
      code: `package com.nexora.salon.ui.screens

// Loyalty Points & Rewards Section in Jetpack Compose
Card(
    modifier = Modifier.fillMaxWidth(),
    shape = RoundedCornerShape(16.dp),
    colors = CardDefaults.cardColors(containerColor = Color(0xFFFDE7F3))
) {
    Column(modifier = Modifier.padding(16.dp)) {
        Text("LOYALTY REWARDS", fontWeight = FontWeight.Bold, color = NexoraPrimary)
        Text("Earned from total booking history (10% back on bills)")
        Row {
            Button(onClick = { /* Redeem 200 PTS -> ₹200 OFF */ }) { Text("₹200 OFF") }
            Button(onClick = { /* Redeem 500 PTS -> ₹500 OFF */ }) { Text("₹500 OFF") }
            Button(onClick = { /* Redeem 1000 PTS -> ₹1,000 OFF */ }) { Text("₹1,000 OFF") }
        }
    }
}`
    },
    'build.gradle.kts': {
      desc: 'Gradle Kotlin DSL with Jetpack Compose, Material 3, Navigation, Coroutines, and Supabase BOM',
      code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
    alias(libs.plugins.kotlin.serialization)
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.material3)
    implementation(libs.androidx.navigation.compose)
    implementation(platform(libs.supabase.bom))
    implementation(libs.supabase.gotrue)
    implementation(libs.supabase.storage)
}`
    }
  };

  const currentFileData = filesMap[selectedFile];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFileData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="bg-[#FCF9F8] rounded-2xl max-w-4xl w-full overflow-hidden shadow-2xl border border-[#E8E8E8] flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#E8E8E8] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#8e004b] text-white flex items-center justify-center shadow-xs">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-display text-lg font-bold text-[#1c1b1b]">
                  Native Android Architecture (Kotlin & Jetpack Compose)
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FDE7F3] text-[#8e004b]">
                  Material 3
                </span>
              </div>
              <p className="text-xs text-[#594047]">
                MVVM • Navigation Compose • Supabase Auth & Storage • Kotlin Coroutines & Flow • Repository Pattern
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F0EDEC] hover:bg-[#ece7e7] text-[#1c1b1b] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Feature Badges Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F0EDEC] border-b border-[#E8E8E8] text-xs">
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E8E8E8]">
            <Layers className="w-4 h-4 text-[#8e004b]" />
            <span><strong>MVVM</strong> + Flow</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E8E8E8]">
            <ShieldCheck className="w-4 h-4 text-[#8e004b]" />
            <span><strong>Supabase</strong> Auth</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E8E8E8]">
            <Database className="w-4 h-4 text-[#8e004b]" />
            <span><strong>Storage</strong> Photos</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#E8E8E8]">
            <Bell className="w-4 h-4 text-[#8e004b]" />
            <span><strong>FCM</strong> Push Alerts</span>
          </div>
        </div>

        {/* File Tabs & Code Preview */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2 no-scrollbar">
            {Object.keys(filesMap).map((fileName) => (
              <button
                key={fileName}
                onClick={() => setSelectedFile(fileName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  selectedFile === fileName
                    ? 'bg-[#8e004b] text-white shadow-xs'
                    : 'bg-white text-[#594047] hover:bg-[#ece7e7] border border-[#E8E8E8]'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>{fileName}</span>
              </button>
            ))}
          </div>

          <div className="bg-[#1c1b1b] rounded-xl p-4 text-white font-mono text-xs overflow-x-auto relative shadow-inner">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-800 text-stone-400">
              <span className="text-[11px] font-sans">{currentFileData.desc}</span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-sans flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied' : 'Copy Code'}</span>
              </button>
            </div>
            <pre className="text-emerald-400">{currentFileData.code}</pre>
          </div>

          <div className="p-3 bg-[#FDE7F3]/40 rounded-xl border border-[#ffcbd9] text-xs text-[#594047] flex items-center justify-between">
            <span>
              All native Android source files are stored in the <code className="font-bold text-[#8e004b]">/android</code> folder of this project with complete Gradle Kotlin DSL configuration.
            </span>
            <span className="font-bold text-[#8e004b] uppercase text-[10px] whitespace-nowrap pl-2">
              Ready for Android Studio
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E8E8] flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#8e004b] hover:bg-[#b90064] text-white text-xs uppercase tracking-wider font-semibold rounded-lg cursor-pointer"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
