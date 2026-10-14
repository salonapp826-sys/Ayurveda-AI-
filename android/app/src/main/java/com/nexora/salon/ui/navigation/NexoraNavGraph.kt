package com.nexora.salon.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.navArgument
import com.nexora.salon.ui.components.NexoraBottomNavBar
import com.nexora.salon.ui.components.NexoraTopAppBar
import com.nexora.salon.ui.components.WhatsAppFloatingActionButton
import com.nexora.salon.ui.screens.*
import com.nexora.salon.ui.viewmodel.AuthViewModel
import com.nexora.salon.ui.viewmodel.BookingViewModel
import com.nexora.salon.ui.viewmodel.SalonViewModel

@Composable
fun NexoraNavGraph(
    navController: NavHostController,
    authViewModel: AuthViewModel,
    salonViewModel: SalonViewModel,
    bookingViewModel: BookingViewModel
) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        topBar = {
            NexoraTopAppBar(title = "NEXORA SALON")
        },
        bottomBar = {
            NexoraBottomNavBar(
                currentRoute = currentRoute,
                onNavigate = { route ->
                    navController.navigate(route) {
                        popUpTo(Screen.Home.route) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    ) { innerPadding ->
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
        ) {
            NavHost(
                navController = navController,
                startDestination = Screen.Home.route,
                modifier = Modifier.fillMaxSize()
            ) {
                composable(Screen.Home.route) {
                    HomeScreen(
                        salonViewModel = salonViewModel,
                        onNavigateToServices = { navController.navigate(Screen.Services.route) },
                        onNavigateToBooking = { treatmentId ->
                            navController.navigate(Screen.Booking.createRoute(treatmentId))
                        },
                        onNavigateToBoutique = { navController.navigate(Screen.Boutique.route) }
                    )
                }

                composable(Screen.Services.route) {
                    ServicesScreen(
                        salonViewModel = salonViewModel,
                        onBookService = { treatmentId ->
                            navController.navigate(Screen.Booking.createRoute(treatmentId))
                        }
                    )
                }

                composable(
                    route = Screen.Booking.route,
                    arguments = listOf(navArgument("treatmentId") { nullable = true })
                ) { backStackEntry ->
                    val treatmentId = backStackEntry.arguments?.getString("treatmentId")
                    BookingScreen(
                        bookingViewModel = bookingViewModel,
                        salonViewModel = salonViewModel,
                        preselectedTreatmentId = treatmentId,
                        onFinish = {
                            navController.navigate(Screen.Home.route) {
                                popUpTo(Screen.Home.route) { inclusive = true }
                            }
                        }
                    )
                }

                composable(Screen.Boutique.route) {
                    BoutiqueScreen(salonViewModel = salonViewModel)
                }

                composable(Screen.Profile.route) {
                    ProfileScreen(
                        authViewModel = authViewModel,
                        salonViewModel = salonViewModel
                    )
                }
            }

            // Floating WhatsApp Button on bottom right (pre-filled chat to +91 98201 45890)
            WhatsAppFloatingActionButton(
                modifier = Modifier.align(Alignment.BottomEnd)
            )
        }
    }
}
