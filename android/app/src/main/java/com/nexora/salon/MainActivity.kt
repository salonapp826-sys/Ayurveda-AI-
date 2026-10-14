package com.nexora.salon

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelProvider
import androidx.navigation.compose.rememberNavController
import com.nexora.salon.data.repository.InMemorySalonRepository
import com.nexora.salon.data.repository.SupabaseAuthRepository
import com.nexora.salon.data.repository.SupabaseStorageRepository
import com.nexora.salon.ui.navigation.NexoraNavGraph
import com.nexora.salon.ui.theme.NexoraSalonTheme
import com.nexora.salon.ui.viewmodel.AuthViewModel
import com.nexora.salon.ui.viewmodel.BookingViewModel
import com.nexora.salon.ui.viewmodel.SalonViewModel

class MainActivity : ComponentActivity() {

    private val authRepository = SupabaseAuthRepository()
    private val storageRepository = SupabaseStorageRepository()
    private val salonRepository = InMemorySalonRepository()

    private val authViewModel: AuthViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return AuthViewModel(authRepository, storageRepository) as T
            }
        }
    }

    private val salonViewModel: SalonViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return SalonViewModel(salonRepository) as T
            }
        }
    }

    private val bookingViewModel: BookingViewModel by viewModels {
        object : ViewModelProvider.Factory {
            override fun <T : ViewModel> create(modelClass: Class<T>): T {
                @Suppress("UNCHECKED_CAST")
                return BookingViewModel(salonRepository) as T
            }
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            NexoraSalonTheme {
                val navController = rememberNavController()
                NexoraNavGraph(
                    navController = navController,
                    authViewModel = authViewModel,
                    salonViewModel = salonViewModel,
                    bookingViewModel = bookingViewModel
                )
            }
        }
    }
}
