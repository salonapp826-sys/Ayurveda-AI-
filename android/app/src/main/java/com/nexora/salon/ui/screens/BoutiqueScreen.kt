package com.nexora.salon.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
fun BoutiqueScreen(
    salonViewModel: SalonViewModel
) {
    val products by salonViewModel.products.collectAsState()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF8F8)),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = NexoraPrimary)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Nexora Beauty Store", color = Color(0xFFFFCBD9), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    Text("100% Original Ayurvedic Formulations", color = Color.White, fontSize = 18.sp, fontWeight = FontWeight.Bold)
                    Spacer(modifier = Modifier.height(4.dp))
                    Text("Free courier delivery across India on all beauty products & gift vouchers.", color = Color.White.copy(alpha = 0.85f), fontSize = 11.sp)
                }
            }
        }

        items(products) { prod ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = prod.image,
                        contentDescription = prod.name,
                        modifier = Modifier
                            .size(80.dp)
                            .clip(RoundedCornerShape(10.dp)),
                        contentScale = ContentScale.Crop
                    )
                    Spacer(modifier = Modifier.width(12.dp))
                    Column(modifier = Modifier.weight(1f)) {
                        Text(prod.category.uppercase(), color = NexoraPrimary, fontSize = 9.sp, fontWeight = FontWeight.Bold)
                        Text(prod.name, fontWeight = FontWeight.Bold, fontSize = 14.sp)
                        Text(prod.subTitle, fontSize = 11.sp, color = Color(0xFF594047), maxLines = 1)
                        Spacer(modifier = Modifier.height(4.dp))
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text("₹${prod.priceINR}", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)
                            Button(
                                onClick = { /* Add to Cart */ },
                                colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary),
                                shape = RoundedCornerShape(6.dp),
                                contentPadding = PaddingValues(horizontal = 12.dp, vertical = 6.dp)
                            ) {
                                Text("Buy Now", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }
        }
    }
}
