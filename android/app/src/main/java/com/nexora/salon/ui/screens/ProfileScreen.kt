package com.nexora.salon.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.CameraAlt
import androidx.compose.material.icons.filled.Person
import androidx.compose.material3.*
import androidx.compose.runtime.*
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
import com.nexora.salon.ui.theme.NexoraSurfaceVariant
import com.nexora.salon.ui.viewmodel.AuthViewModel
import com.nexora.salon.ui.viewmodel.SalonViewModel

@Composable
fun ProfileScreen(
    authViewModel: AuthViewModel,
    salonViewModel: SalonViewModel
) {
    val authState by authViewModel.uiState.collectAsState()
    val bookings by salonViewModel.bookings.collectAsState()
    val user = authState.user

    var loginEmail by remember { mutableStateOf("salonapp826@gmail.com") }
    var loginPassword by remember { mutableStateOf("••••••••") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFDF8F8))
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        if (user != null) {
            // Logged In Member Card
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Box(contentAlignment = Alignment.BottomEnd) {
                        if (user.avatarUrl != null) {
                            AsyncImage(
                                model = user.avatarUrl,
                                contentDescription = "Avatar",
                                modifier = Modifier
                                    .size(80.dp)
                                    .clip(CircleShape),
                                contentScale = ContentScale.Crop
                            )
                        } else {
                            Surface(
                                modifier = Modifier.size(80.dp),
                                shape = CircleShape,
                                color = Color(0xFFFDE7F3)
                            ) {
                                Icon(
                                    Icons.Filled.Person,
                                    contentDescription = null,
                                    tint = NexoraPrimary,
                                    modifier = Modifier.padding(16.dp)
                                )
                            }
                        }

                        IconButton(
                            onClick = {
                                // Upload mock image bytes to Supabase Storage
                                authViewModel.uploadProfilePhoto(ByteArray(1024))
                            },
                            modifier = Modifier
                                .size(28.dp)
                                .clip(CircleShape)
                                .background(NexoraPrimary)
                        ) {
                            Icon(Icons.Filled.CameraAlt, contentDescription = "Upload", tint = Color.White, modifier = Modifier.size(16.dp))
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))
                    Text(user.fullName, fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Text(user.email, fontSize = 12.sp, color = Color(0xFF594047))
                    Text(user.membershipTier, fontSize = 11.sp, color = NexoraPrimary, fontWeight = FontWeight.SemiBold)

                    Spacer(modifier = Modifier.height(14.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("${user.loyaltyPoints} PTS", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = NexoraPrimary)
                            Text("Reward Points", fontSize = 10.sp, color = Color(0xFF594047))
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("${bookings.size}", fontWeight = FontWeight.Bold, fontSize = 16.sp, color = NexoraPrimary)
                            Text("Total Bookings", fontSize = 10.sp, color = Color(0xFF594047))
                        }
                    }
                }
            }

            // Consent & Privacy Section (Material 3 Switch)
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text("Privacy & Diagnostics Consent", fontWeight = FontWeight.Bold, fontSize = 14.sp)
                    Spacer(modifier = Modifier.height(6.dp))
                    Text(
                        "Help us improve the salon booking experience with anonymous crash reporting and performance metrics.",
                        fontSize = 11.sp,
                        color = Color(0xFF594047)
                    )
                    Spacer(modifier = Modifier.height(10.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("Anonymous Crash Analytics", fontSize = 12.sp, fontWeight = FontWeight.SemiBold)
                        Switch(
                            checked = user.analyticsConsent,
                            onCheckedChange = { authViewModel.updateConsent(it) }
                        )
                    }
                }
            }

            // Loyalty Points & Rewards Section
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFFDE7F3))
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("LOYALTY REWARDS", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NexoraPrimary)
                            Text("Salon Points & Discounts", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                        Surface(shape = RoundedCornerShape(8.dp), color = NexoraPrimary) {
                            Text("1 PT = ₹1", modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), color = Color.White, fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Text(
                        "Earned 10% back on every booking in your total history (${bookings.size} appointments = ${bookings.sumOf { (it.totalPriceINR * 0.10).toInt() }} pts) + 500 Welcome Bonus.",
                        fontSize = 11.sp,
                        color = Color(0xFF594047)
                    )

                    // Redeem Discount Options
                    Text("Redeem Points for Salon Discounts:", fontSize = 12.sp, fontWeight = FontWeight.Bold)
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { /* Redeem 200 pts for ₹200 off */ },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary)
                        ) {
                            Text("₹200 OFF\n(200 pts)", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = { /* Redeem 500 pts for ₹500 off */ },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary)
                        ) {
                            Text("₹500 OFF\n(500 pts)", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                        Button(
                            onClick = { /* Redeem 1000 pts for ₹1000 off */ },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(8.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary)
                        ) {
                            Text("₹1,000 OFF\n(1000 pts)", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            // Invite Friends & Referral Bonus Section
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text("INVITE FRIENDS", fontWeight = FontWeight.Bold, fontSize = 11.sp, color = NexoraPrimary)
                            Text("Earn 500 Bonus Points", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                        }
                        Surface(shape = RoundedCornerShape(8.dp), color = Color(0xFFFFD700)) {
                            Text("+500 PTS", modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), color = Color(0xFF1C1B1B), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }

                    Text(
                        "Give 500 points • Get 500 points! Share your referral code. When a friend signs up, both receive 500 bonus loyalty points (worth ₹500 salon discount).",
                        fontSize = 11.sp,
                        color = Color(0xFF594047)
                    )

                    // Referral Code Box
                    Surface(
                        shape = RoundedCornerShape(10.dp),
                        color = Color(0xFFFDE7F3),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(
                            modifier = Modifier.padding(12.dp).fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Column {
                                Text("YOUR REFERRAL CODE", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF594047))
                                Text("RIYA500", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)
                            }
                            Button(
                                onClick = { /* Share code via WhatsApp or SMS intent */ },
                                shape = RoundedCornerShape(8.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32))
                            ) {
                                Text("Share on WhatsApp", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            // My Salon Appointments History
            Text("Upcoming Bookings", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            bookings.forEach { b ->
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = NexoraSurfaceVariant)
                ) {
                    Column(modifier = Modifier.padding(14.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Row(modifier = Modifier.fillMaxWidth(), horizontalArrangement = Arrangement.SpaceBetween) {
                            Text(b.bookingCode, fontWeight = FontWeight.Bold, color = NexoraPrimary, fontSize = 12.sp)
                            Text(b.status, fontWeight = FontWeight.Bold, color = Color(0xFF2E7D32), fontSize = 11.sp)
                        }
                        Text(b.treatmentTitle, fontWeight = FontWeight.Bold, fontSize = 13.sp)
                        Text("${b.date} at ${b.timeSlot} • ${b.artisanName}", fontSize = 11.sp, color = Color(0xFF594047))
                        Text("Welcome Drink: ${b.beverageChoice}", fontSize = 11.sp, color = Color(0xFF594047))
                    }
                }
            }

            Button(
                onClick = { authViewModel.logout() },
                colors = ButtonDefaults.buttonColors(containerColor = Color.Transparent, contentColor = NexoraPrimary),
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Sign Out of Nexora Account", fontWeight = FontWeight.Bold)
            }
        } else {
            // Sign in / Sign up form with Supabase GoTrue
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(20.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Nexora Member Sign In", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = NexoraPrimary)
                    Text("Powered by Supabase Authentication", fontSize = 11.sp, color = Color(0xFF594047))

                    OutlinedTextField(
                        value = loginEmail,
                        onValueChange = { loginEmail = it },
                        label = { Text("Email Address") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )

                    OutlinedTextField(
                        value = loginPassword,
                        onValueChange = { loginPassword = it },
                        label = { Text("Password") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(8.dp)
                    )

                    Button(
                        onClick = { authViewModel.login(loginEmail, loginPassword) },
                        colors = ButtonDefaults.buttonColors(containerColor = NexoraPrimary),
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text("Login to Account", fontWeight = FontWeight.Bold)
                    }
                }
            }
        }
    }
}
