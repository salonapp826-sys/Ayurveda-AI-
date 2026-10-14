package com.nexora.salon.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CalendarMonth
import androidx.compose.material.icons.filled.Star
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.nexora.salon.ui.theme.NexoraGold
import com.nexora.salon.ui.theme.NexoraPrimary
import com.nexora.salon.ui.theme.NexoraSurfaceVariant
import com.nexora.salon.ui.viewmodel.SalonViewModel

@Composable
fun HomeScreen(
    salonViewModel: SalonViewModel,
    onNavigateToServices: () -> Unit,
    onNavigateToBooking: (String?) -> Unit,
    onNavigateToBoutique: () -> Unit
) {
    val treatments by salonViewModel.treatments.collectAsState()
    val artisans by salonViewModel.artisans.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF8F8)),
        contentPadding = PaddingValues(bottom = 88.dp)
    ) {
        // Tagline Banner
        item {
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(16.dp),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = NexoraPrimary)
            ) {
                Column(modifier = Modifier.padding(20.dp)) {
                    Text(
                        text = "Salon जा रहे हो?",
                        color = Color.White.copy(alpha = 0.9f),
                        fontSize = 18.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        text = "NEXORA किया क्या?",
                        color = Color.White,
                        fontSize = 24.sp,
                        fontWeight = FontWeight.Bold
                    )
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        text = "Authentic Ayurveda • Designer Haircuts • 100% Original Beauty Products",
                        color = Color(0xFFFFCBD9),
                        fontSize = 12.sp
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Button(
                        onClick = { onNavigateToBooking(null) },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White),
                        shape = RoundedCornerShape(10.dp)
                    ) {
                        Text(
                            text = "Book Salon Appointment",
                            color = NexoraPrimary,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }
            }
        }

        // Quick Category Action Cards
        item {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onNavigateToServices() },
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NexoraSurfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("All Services", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Head Spa, Cuts, Glow", fontSize = 10.sp, color = Color(0xFF594047))
                    }
                }

                Card(
                    modifier = Modifier
                        .weight(1f)
                        .clickable { onNavigateToBoutique() },
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NexoraSurfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text("Beauty Store", fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("Oils, Creams & Vouchers", fontSize = 10.sp, color = Color(0xFF594047))
                    }
                }
            }
        }

        // Popular Treatments Section
        item {
            Spacer(modifier = Modifier.height(20.dp))
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Popular Salon Services",
                    fontSize = 18.sp,
                    fontWeight = FontWeight.Bold
                )
                TextButton(onClick = onNavigateToServices) {
                    Text("View All", color = NexoraPrimary, fontSize = 12.sp)
                }
            }
        }

        items(treatments.take(3)) { treatment ->
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 6.dp)
                    .clickable { onNavigateToBooking(treatment.id) },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = treatment.image,
                        contentDescription = treatment.title,
                        modifier = Modifier
                            .size(72.dp)
                            .clip(RoundedCornerShape(12.dp)),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = treatment.category.uppercase(),
                            color = NexoraPrimary,
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold
                        )
                        Text(
                            text = treatment.title,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            maxLines = 1
                        )
                        Text(
                            text = "${treatment.durationMinutes} mins • ₹${treatment.priceINR}",
                            fontSize = 12.sp,
                            color = Color(0xFF594047),
                            fontWeight = FontWeight.SemiBold
                        )
                    }
                    IconButton(onClick = { onNavigateToBooking(treatment.id) }) {
                        Icon(Icons.Filled.ArrowForward, contentDescription = "Book", tint = NexoraPrimary)
                    }
                }
            }
        }

        // Senior Stylists & Doctors Section
        item {
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "Senior Stylists & Doctors",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp)
            )

            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                items(artisans) { artisan ->
                    Card(
                        modifier = Modifier.width(220.dp),
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                AsyncImage(
                                    model = artisan.avatar,
                                    contentDescription = artisan.name,
                                    modifier = Modifier
                                        .size(48.dp)
                                        .clip(CircleShape),
                                    contentScale = ContentScale.Crop
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Column {
                                    Text(artisan.name, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                                    Row(verticalAlignment = Alignment.CenterVertically) {
                                        Icon(Icons.Filled.Star, contentDescription = "Rating", tint = NexoraGold, modifier = Modifier.size(12.dp))
                                        Text("${artisan.rating}", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                            }
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(artisan.role, fontSize = 11.sp, color = NexoraPrimary, fontWeight = FontWeight.SemiBold)
                            Text("${artisan.experienceYears} Years Salon Experience", fontSize = 10.sp, color = Color(0xFF594047))
                        }
                    }
                }
            }
        }
    }
}
