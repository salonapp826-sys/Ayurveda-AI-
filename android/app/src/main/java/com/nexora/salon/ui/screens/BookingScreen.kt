package com.nexora.salon.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.nexora.salon.ui.theme.NexoraGreen
import com.nexora.salon.ui.theme.NexoraPrimary
import com.nexora.salon.ui.theme.NexoraSurfaceVariant
import com.nexora.salon.ui.viewmodel.BookingViewModel
import com.nexora.salon.ui.viewmodel.SalonViewModel

@Composable
fun BookingScreen(
    bookingViewModel: BookingViewModel,
    salonViewModel: SalonViewModel,
    preselectedTreatmentId: String? = null,
    onFinish: () -> Unit
) {
    val treatments by salonViewModel.treatments.collectAsState()
    val artisans by salonViewModel.artisans.collectAsState()
    val state by bookingViewModel.state.collectAsState()

    LaunchedEffect(preselectedTreatmentId, treatments) {
        if (preselectedTreatmentId != null) {
            val match = treatments.find { it.id == preselectedTreatmentId }
            if (match != null) {
                bookingViewModel.setTreatment(match)
            }
        } else if (state.selectedTreatment == null && treatments.isNotEmpty()) {
            bookingViewModel.setTreatment(treatments.first())
        }
        if (state.selectedArtisan == null && artisans.isNotEmpty()) {
            bookingViewModel.setArtisan(artisans.first())
        }
    }

    if (state.isConfirmed && state.confirmedBooking != null) {
        val b = state.confirmedBooking!!
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFFDF8F8))
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.Center
        ) {
            Icon(
                Icons.Filled.CheckCircle,
                contentDescription = "Success",
                tint = NexoraGreen,
                modifier = Modifier.size(64.dp)
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("Salon Booking Confirmed!", fontSize = 22.sp, fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(8.dp))
            Text("Booking Ref: ${b.bookingCode}", fontSize = 14.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)
            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NexoraSurfaceVariant)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(6.dp)) {
                    Text("Service: ${b.treatmentTitle}", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                    Text("Stylist: ${b.artisanName}", fontSize = 12.sp)
                    Text("Branch: ${b.sanctuaryCity}", fontSize = 12.sp)
                    Text("Date & Time: ${b.date} at ${b.timeSlot}", fontSize = 12.sp)
                    Text("Welcome Drink: ${b.beverageChoice}", fontSize = 12.sp)
                    Text("Total Price: ₹${b.totalPriceINR}", fontWeight = FontWeight.Bold, color = NexoraPrimary, fontSize = 14.sp)
                }
            }

            Spacer(modifier = Modifier.height(24.dp))
            Button(
                onClick = {
                    bookingViewModel.reset()
                    onFinish()
                },
                colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary),
                shape = RoundedCornerShape(10.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Back to Home", fontWeight = FontWeight.Bold)
            }
        }
        return
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF8F8))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Text("Book Salon Appointment", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)

        // Selected Service Card
        state.selectedTreatment?.let { t ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(14.dp)) {
                    Text("Selected Service", fontSize = 11.sp, color = NexoraPrimary, fontWeight = FontWeight.Bold)
                    Text(t.title, fontSize = 15.sp, fontWeight = FontWeight.Bold)
                    Text("Duration: ${t.durationMinutes} mins • Price: ₹${t.priceINR}", fontSize = 12.sp, color = Color(0xFF594047))
                }
            }
        }

        // Stylist Selection
        Text("Select Stylist / Doctor", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        artisans.forEach { a ->
            val isSelected = state.selectedArtisan?.id == a.id
            Card(
                onClick = { bookingViewModel.setArtisan(a) },
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(10.dp),
                colors = CardDefaults.cardColors(
                    containerColor = if (isSelected) Color(0xFFFDE7F3) else Color.White
                )
            ) {
                Row(modifier = Modifier.padding(12.dp), verticalAlignment = Alignment.CenterVertically) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(a.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text(a.role, fontSize = 11.sp, color = NexoraPrimary)
                    }
                    RadioButton(
                        selected = isSelected,
                        onClick = { bookingViewModel.setArtisan(a) }
                    )
                }
            }
        }

        // Guest Information
        Text("Guest Details", fontSize = 14.sp, fontWeight = FontWeight.Bold)
        var name by remember { mutableStateOf(state.guestName) }
        var phone by remember { mutableStateOf(state.guestPhone) }

        OutlinedTextField(
            value = name,
            onValueChange = { name = it },
            label = { Text("Your Full Name") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        )

        OutlinedTextField(
            value = phone,
            onValueChange = { phone = it },
            label = { Text("Mobile Number (+91)") },
            modifier = Modifier.fillMaxWidth(),
            shape = RoundedCornerShape(8.dp)
        )

        Button(
            onClick = {
                bookingViewModel.updateDetails(
                    date = state.date,
                    timeSlot = state.timeSlot,
                    name = name,
                    phone = phone,
                    email = state.guestEmail,
                    beverage = state.beverage,
                    aroma = state.aroma,
                    notes = state.notes
                )
                bookingViewModel.confirmBooking()
            },
            colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary),
            shape = RoundedCornerShape(10.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 10.dp)
        ) {
            Text("Confirm Booking & Send WhatsApp Confirmation", fontWeight = FontWeight.Bold, fontSize = 13.sp)
        }
    }
}
