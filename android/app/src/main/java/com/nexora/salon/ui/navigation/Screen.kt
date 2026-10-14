package com.nexora.salon.ui.navigation

sealed class Screen(val route: String, val title: String) {
    object Home : Screen("home", "Home")
    object Services : Screen("services", "Services")
    object Booking : Screen("booking?treatmentId={treatmentId}", "Book Appointment") {
        fun createRoute(treatmentId: String? = null) = if (treatmentId != null) "booking?treatmentId=$treatmentId" else "booking"
    }
    object Boutique : Screen("boutique", "Boutique")
    object Profile : Screen("profile", "Profile")
}
