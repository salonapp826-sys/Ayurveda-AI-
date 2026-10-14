package com.nexora.salon.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.nexora.salon.ui.theme.NexoraPrimary
import com.nexora.salon.ui.viewmodel.SalonViewModel

@Composable
fun ServicesScreen(
    salonViewModel: SalonViewModel,
    onBookService: (String) -> Unit
) {
    val treatments by salonViewModel.treatments.collectAsState()
    val selectedCategory by salonViewModel.selectedCategory.collectAsState()

    val categories = listOf(
        "All",
        "Hair Styling & Cuts",
        "Ayurvedic Head Massage",
        "Gold & Glow Facials"
    )

    val filteredTreatments = treatments.filter {
        selectedCategory == "All" || it.category == selectedCategory
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF8F8))
    ) {
        // Category Chips
        LazyRow(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp),
            contentPadding = PaddingValues(horizontal = 16.dp),
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            items(categories) { category ->
                val isSelected = selectedCategory == category
                FilterChip(
                    selected = isSelected,
                    onClick = { salonViewModel.setCategory(category) },
                    label = { Text(category, fontSize = 12.sp, fontWeight = if (isSelected) FontWeight.Bold else FontWeight.Normal) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = NexoraPrimary,
                        selectedLabelColor = Color.White
                    )
                )
            }
        }

        // Treatments List
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 8.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            items(filteredTreatments) { item ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
                ) {
                    Column(modifier = Modifier.padding(14.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            AsyncImage(
                                model = item.image,
                                contentDescription = item.title,
                                modifier = Modifier
                                    .size(80.dp)
                                    .clip(RoundedCornerShape(12.dp)),
                                contentScale = ContentScale.Crop
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Column(modifier = Modifier.weight(1f)) {
                                Text(
                                    text = item.category.uppercase(),
                                    color = NexoraPrimary,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Bold
                                )
                                Text(
                                    text = item.title,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp
                                )
                                Text(
                                    text = item.subTitle,
                                    fontSize = 11.sp,
                                    color = Color(0xFF594047),
                                    maxLines = 2
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(10.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("₹${item.priceINR}", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)
                                Text("${item.durationMinutes} minutes", fontSize = 10.sp, color = Color(0xFF594047))
                            }
                            Button(
                                onClick = { onBookService(item.id) },
                                colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Text("Book Appointment", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
