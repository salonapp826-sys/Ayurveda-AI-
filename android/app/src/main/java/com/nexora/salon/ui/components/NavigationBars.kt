package com.nexora.salon.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Person
import androidx.compose.material.icons.filled.ShoppingBag
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBar
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.nexora.salon.ui.navigation.Screen
import com.nexora.salon.ui.theme.NexoraPrimary
import com.nexora.salon.ui.theme.NexoraSurface

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NexoraTopAppBar(title: String) {
    TopAppBar(
        title = {
            Text(
                text = title,
                fontWeight = FontWeight.Bold,
                color = NexoraPrimary,
                fontSize = 20.sp
            )
        },
        colors = TopAppBarDefaults.topAppBarColors(
            containerColor = NexoraSurface
        )
    )
}

@Composable
fun NexoraBottomNavBar(
    currentRoute: String?,
    onNavigate: (String) -> Unit
) {
    val items = listOf(
        Triple(Screen.Home.route, "Home", Icons.Filled.Home),
        Triple(Screen.Services.route, "Services", Icons.Filled.Spa),
        Triple(Screen.Boutique.route, "Boutique", Icons.Filled.ShoppingBag),
        Triple(Screen.Booking.route, "Book", Icons.Filled.CalendarMonth),
        Triple(Screen.Profile.route, "Profile", Icons.Filled.Person)
    )

    NavigationBar(
        containerColor = NexoraSurface
    ) {
        items.forEach { (route, label, icon) ->
            val isSelected = currentRoute?.startsWith(route.substringBefore("?")) == true
            NavigationBarItem(
                selected = isSelected,
                onClick = { onNavigate(route) },
                icon = { Icon(icon, contentDescription = label) },
                label = { Text(label, fontSize = 11.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = NexoraPrimary,
                    selectedTextColor = NexoraPrimary,
                    indicatorColor = Color(0xFFFDE7F3)
                )
            )
        }
    }
}
