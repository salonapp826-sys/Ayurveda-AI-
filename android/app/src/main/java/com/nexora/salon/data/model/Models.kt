package com.nexora.salon.data.model

import kotlinx.serialization.Serializable

@Serializable
data class Treatment(
    val id: String,
    val title: String,
    val subTitle: String,
    val category: String,
    val durationMinutes: Int,
    val priceINR: Int,
    val priceUSD: Int,
    val description: String,
    val philosophy: String,
    val benefits: List<String>,
    val keyBotanicals: List<String>,
    val suitableFor: String,
    val image: String
)

@Serializable
data class Artisan(
    val id: String,
    val name: String,
    val role: String,
    val title: String,
    val experienceYears: Int,
    val rating: Double,
    val reviewsCount: Int,
    val bio: String,
    val specialties: List<String>,
    val avatar: String,
    val signatureRitual: String
)

@Serializable
data class Product(
    val id: String,
    val name: String,
    val subTitle: String,
    val category: String,
    val priceINR: Int,
    val priceUSD: Int,
    val volume: String,
    val description: String,
    val ingredients: List<String>,
    val benefits: List<String>,
    val image: String,
    val inStock: Boolean = true
)

@Serializable
data class Booking(
    val id: String,
    val bookingCode: String,
    val treatmentId: String,
    val treatmentTitle: String,
    val artisanName: String,
    val sanctuaryCity: String,
    val date: String,
    val timeSlot: String,
    val guestName: String,
    val guestPhone: String,
    val guestEmail: String,
    val beverageChoice: String,
    val aromaPreference: String,
    val notes: String = "",
    val totalPriceINR: Int,
    val status: String = "Confirmed",
    val createdAt: String
)

@Serializable
data class UserProfile(
    val id: String,
    val email: String,
    val fullName: String,
    val phone: String? = null,
    val avatarUrl: String? = null,
    val membershipTier: String = "Nexora Circle",
    val loyaltyPoints: Int = 500,
    val analyticsConsent: Boolean = true
)
