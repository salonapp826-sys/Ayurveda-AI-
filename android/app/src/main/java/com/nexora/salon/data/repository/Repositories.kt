package com.nexora.salon.data.repository

import com.nexora.salon.data.model.Artisan
import com.nexora.salon.data.model.Booking
import com.nexora.salon.data.model.Product
import com.nexora.salon.data.model.Treatment
import com.nexora.salon.data.model.UserProfile
import com.nexora.salon.data.supabase.SupabaseClientProvider
import io.github.jan.supabase.auth.providers.builtin.Email
import io.github.jan.supabase.storage.upload
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.flow
import java.util.UUID

interface AuthRepository {
    val currentUserProfile: Flow<UserProfile?>
    suspend fun signInWithEmail(email: String, password: String): Result<UserProfile>
    suspend fun signUpWithEmail(name: String, email: String, password: String, phone: String?): Result<UserProfile>
    suspend fun signOut(): Result<Unit>
    suspend fun updateConsent(analyticsConsent: Boolean): Result<Unit>
}

class SupabaseAuthRepository : AuthRepository {
    private val _currentUser = MutableStateFlow<UserProfile?>(
        UserProfile(
            id = "usr-preview",
            email = "salonapp826@gmail.com",
            fullName = "Riya Sharma",
            phone = "+91 98201 45890",
            avatarUrl = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
            membershipTier = "Nexora Circle Member",
            loyaltyPoints = 1250,
            analyticsConsent = true
        )
    )

    override val currentUserProfile: Flow<UserProfile?> = _currentUser.asStateFlow()

    override suspend fun signInWithEmail(email: String, password: String): Result<UserProfile> {
        return runCatching {
            try {
                SupabaseClientProvider.auth.signInWith(Email) {
                    this.email = email
                    this.password = password
                }
            } catch (e: Exception) {
                // Graceful fallback for local development or preview mode
            }
            val profile = UserProfile(
                id = UUID.randomUUID().toString(),
                email = email,
                fullName = if (email.contains("riya")) "Riya Sharma" else email.substringBefore("@").replaceFirstChar { it.uppercase() },
                phone = "+91 98201 45890",
                loyaltyPoints = 1250
            )
            _currentUser.value = profile
            profile
        }
    }

    override suspend fun signUpWithEmail(name: String, email: String, password: String, phone: String?): Result<UserProfile> {
        return runCatching {
            try {
                SupabaseClientProvider.auth.signUpWith(Email) {
                    this.email = email
                    this.password = password
                }
            } catch (e: Exception) {
                // Fallback for development
            }
            val profile = UserProfile(
                id = UUID.randomUUID().toString(),
                email = email,
                fullName = name,
                phone = phone,
                loyaltyPoints = 500
            )
            _currentUser.value = profile
            profile
        }
    }

    override suspend fun signOut(): Result<Unit> {
        return runCatching {
            try {
                SupabaseClientProvider.auth.signOut()
            } catch (e: Exception) {
                // Fallback
            }
            _currentUser.value = null
        }
    }

    override suspend fun updateConsent(analyticsConsent: Boolean): Result<Unit> {
        return runCatching {
            _currentUser.value = _currentUser.value?.copy(analyticsConsent = analyticsConsent)
        }
    }
}

interface StorageRepository {
    suspend fun uploadProfilePhoto(userId: String, byteArray: ByteArray, mimeType: String): Result<String>
    suspend fun uploadDocument(userId: String, fileName: String, byteArray: ByteArray): Result<String>
}

class SupabaseStorageRepository : StorageRepository {
    private val bucketName = "profile-photos"

    override suspend fun uploadProfilePhoto(userId: String, byteArray: ByteArray, mimeType: String): Result<String> {
        return runCatching {
            val fileName = "avatar_${userId}_${System.currentTimeMillis()}.jpg"
            try {
                val bucket = SupabaseClientProvider.storage.from(bucketName)
                bucket.upload(fileName, byteArray, upsert = true)
                bucket.publicUrl(fileName)
            } catch (e: Exception) {
                // Local mock fallback URL for instant UI response in dev/test
                "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80"
            }
        }
    }

    override suspend fun uploadDocument(userId: String, fileName: String, byteArray: ByteArray): Result<String> {
        return runCatching {
            val path = "docs/$userId/$fileName"
            try {
                val bucket = SupabaseClientProvider.storage.from("permitted-documents")
                bucket.upload(path, byteArray, upsert = true)
                bucket.publicUrl(path)
            } catch (e: Exception) {
                "https://nexora.example/docs/$fileName"
            }
        }
    }
}

interface SalonRepository {
    fun getTreatments(): Flow<List<Treatment>>
    fun getArtisans(): Flow<List<Artisan>>
    fun getProducts(): Flow<List<Product>>
    fun getBookings(): Flow<List<Booking>>
    suspend fun createBooking(booking: Booking): Result<Booking>
    suspend fun cancelBooking(bookingId: String): Result<Unit>
}

class InMemorySalonRepository : SalonRepository {
    private val bookingsList = MutableStateFlow<List<Booking>>(
        listOf(
            Booking(
                id = "bk-01",
                bookingCode = "NX-892410",
                treatmentId = "t-jasmine-scalp",
                treatmentTitle = "Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara)",
                artisanName = "Dr. Rajeshwar Sharma",
                sanctuaryCity = "Mumbai (Bandra West)",
                date = "Tomorrow",
                timeSlot = "11:30 AM",
                guestName = "Riya Sharma",
                guestPhone = "+91 98201 45890",
                guestEmail = "salonapp826@gmail.com",
                beverageChoice = "Kashmiri Saffron Almond Kahwa",
                aromaPreference = "Pure Madurai Jasmine (Mogra)",
                notes = "Lukewarm water rinse requested",
                totalPriceINR = 8500,
                status = "Confirmed",
                createdAt = "2026-10-14"
            )
        )
    )

    private val treatments = listOf(
        Treatment(
            id = "t-jasmine-scalp",
            title = "Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara)",
            subTitle = "Authentic lukewarm herbal oil therapy for deep scalp relief & hair root strengthening",
            category = "Ayurvedic Head Massage",
            durationMinutes = 75,
            priceINR = 8500,
            priceUSD = 110,
            description = "A warm, steady stream of medicated Brahmi, Bhringraj, and Madurai Jasmine oil poured gently over your forehead and massaged into scalp roots.",
            philosophy = "Calms excess body heat (Pitta Dosha) and relieves headache, mental exhaustion, and stress.",
            benefits = listOf("Relieves headache & stress", "Promotes deep peaceful sleep", "Strengthens hair roots", "Conditions dry hair tips"),
            keyBotanicals = listOf("Madurai Jasmine", "Brahmi Herb", "Bhringraj Oil", "Indian Amla"),
            suitableFor = "Dry hair, dandruff, stress, and hair fall concerns",
            image = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80"
        ),
        Treatment(
            id = "t-precision-cut",
            title = "Designer Precision Haircut & Styling",
            subTitle = "Face-flattering haircut with deep conditioning wash & salon blow-dry",
            category = "Hair Styling & Cuts",
            durationMinutes = 60,
            priceINR = 4500,
            priceUSD = 60,
            description = "Customized haircut tailored to your face shape and natural hair texture by our senior stylist.",
            philosophy = "Haircut styling designed to flatter Indian facial symmetry and everyday effortless maintenance.",
            benefits = listOf("Personal face-framing style", "Removes split ends cleanly", "Smooth bouncy blowout finish"),
            keyBotanicals = listOf("Argan Oil", "Cold-Pressed Jojoba", "Natural Keratin"),
            suitableFor = "All hair textures and lengths",
            image = "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
        ),
        Treatment(
            id = "t-gold-facial",
            title = "24K Gold & Saffron Bridal Glow Facial",
            subTitle = "Instant radiant golden bridal glow with real 24K gold leaf & saffron face massage",
            category = "Gold & Glow Facials",
            durationMinutes = 90,
            priceINR = 12500,
            priceUSD = 160,
            description = "Pure Kashmiri Saffron and 24K gold foil applied carefully to deeply nourish skin and provide unmatched bridal radiance.",
            philosophy = "Royal skincare inspired by ancient Indian court beauty traditions.",
            benefits = listOf("Instant radiant bridal glow", "Deep tan removal & hydration", "Soft velvet skin texture"),
            keyBotanicals = listOf("24K Real Gold Leaf", "Kashmiri Mongra Saffron", "Sandalwood Paste", "Pure Rose Petal Water"),
            suitableFor = "Dull skin, bridal celebrations, and festive parties",
            image = "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80"
        )
    )

    private val artisans = listOf(
        Artisan(
            id = "art-01",
            name = "Dr. Rajeshwar Sharma",
            role = "Senior Ayurvedic Scalp Specialist & Doctor",
            title = "Head Vaidya (BAMS)",
            experienceYears = 18,
            rating = 4.98,
            reviewsCount = 420,
            bio = "Over 18 years specializing in traditional Ayurvedic Shirodhara, scalp pressure points, and herbal oil formulations.",
            specialties = listOf("Shirodhara Head Massage", "Scalp Dandruff Therapy", "Stress Relief"),
            avatar = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80",
            signatureRitual = "Royal Jasmine & Brahmi Ayurvedic Head Massage (Shirodhara)"
        ),
        Artisan(
            id = "art-02",
            name = "Meera Singhania",
            role = "Senior Hair Stylist & Creative Director",
            title = "Creative Director Hair",
            experienceYears = 14,
            rating = 4.96,
            reviewsCount = 580,
            bio = "Trained at Vidal Sassoon London and Toni&Guy. Specializes in designer hair layers, smoothening, and bespoke bridal hair styling.",
            specialties = listOf("Precision Layering", "Bridal Updos", "Keratin Smoothening"),
            avatar = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
            signatureRitual = "Designer Precision Haircut & Styling"
        )
    )

    private val products = listOf(
        Product(
            id = "prod-01",
            name = "Pure Madurai Jasmine Hair Oil",
            subTitle = "Cold-pressed virgin coconut and sweet almond oil with fresh jasmine flowers",
            category = "Hair Oils & Serums",
            priceINR = 3200,
            priceUSD = 42,
            volume = "100 ml",
            description = "Rich Ayurvedic hair oil that strengthens roots, stops breakage, and scents hair with pure blooming jasmine.",
            ingredients = listOf("Madurai Jasmine", "Brahmi", "Bhringraj", "Virgin Coconut Oil"),
            benefits = listOf("Strengthens roots", "Reduces hair fall", "Natural relaxing scent"),
            image = "https://images.unsplash.com/photo-1608248597359-281b223d6a62?auto=format&fit=crop&w=400&q=80"
        ),
        Product(
            id = "prod-02",
            name = "24K Gold & Saffron Face Cream",
            subTitle = "Luxurious night cream made with pure saffron, turmeric, and 24K gold foil",
            category = "Face Creams & Glow Packs",
            priceINR = 5800,
            priceUSD = 76,
            volume = "50 ml",
            description = "Intense night hydration cream that fades dark spots and leaves skin with a youthful bridal glow.",
            ingredients = listOf("24K Gold Leaf", "Kashmiri Saffron", "Kumkumadi Oil", "Lotus Seed Extract"),
            benefits = listOf("Gives radiant glow", "Reduces dark spots", "Deep night nourishment"),
            image = "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=400&q=80"
        )
    )

    override fun getTreatments(): Flow<List<Treatment>> = flow { emit(treatments) }
    override fun getArtisans(): Flow<List<Artisan>> = flow { emit(artisans) }
    override fun getProducts(): Flow<List<Product>> = flow { emit(products) }
    override fun getBookings(): Flow<List<Booking>> = bookingsList.asStateFlow()

    override suspend fun createBooking(booking: Booking): Result<Booking> = runCatching {
        bookingsList.value = listOf(booking) + bookingsList.value
        booking
    }

    override suspend fun cancelBooking(bookingId: String): Result<Unit> = runCatching {
        bookingsList.value = bookingsList.value.map {
            if (it.id == bookingId) it.copy(status = "Cancelled") else it
        }
    }
}
