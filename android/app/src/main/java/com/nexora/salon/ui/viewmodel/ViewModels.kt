package com.nexora.salon.ui.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.nexora.salon.data.model.Artisan
import com.nexora.salon.data.model.Booking
import com.nexora.salon.data.model.Product
import com.nexora.salon.data.model.Treatment
import com.nexora.salon.data.model.UserProfile
import com.nexora.salon.data.repository.AuthRepository
import com.nexora.salon.data.repository.SalonRepository
import com.nexora.salon.data.repository.StorageRepository
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch

data class AuthUiState(
    val user: UserProfile? = null,
    val isLoading: Boolean = false,
    val error: String? = null,
    val isSuccess: Boolean = false
)

class AuthViewModel(
    private val authRepository: AuthRepository,
    private val storageRepository: StorageRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(AuthUiState())
    val uiState: StateFlow<AuthUiState> = _uiState.asStateFlow()

    init {
        viewModelScope.launch {
            authRepository.currentUserProfile.collect { profile ->
                _uiState.value = _uiState.value.copy(user = profile)
            }
        }
    }

    fun login(email: String, pass: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = authRepository.signInWithEmail(email, pass)
            result.fold(
                onSuccess = { user ->
                    _uiState.value = _uiState.value.copy(isLoading = false, user = user, isSuccess = true)
                },
                onFailure = { err ->
                    _uiState.value = _uiState.value.copy(isLoading = false, error = err.localizedMessage)
                }
            )
        }
    }

    fun signUp(name: String, email: String, pass: String, phone: String?) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true, error = null)
            val result = authRepository.signUpWithEmail(name, email, pass, phone)
            result.fold(
                onSuccess = { user ->
                    _uiState.value = _uiState.value.copy(isLoading = false, user = user, isSuccess = true)
                },
                onFailure = { err ->
                    _uiState.value = _uiState.value.copy(isLoading = false, error = err.localizedMessage)
                }
            )
        }
    }

    fun uploadProfilePhoto(bytes: ByteArray) {
        val current = _uiState.value.user ?: return
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)
            val uploadResult = storageRepository.uploadProfilePhoto(current.id, bytes, "image/jpeg")
            uploadResult.onSuccess { url ->
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    user = current.copy(avatarUrl = url)
                )
            }
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.signOut()
            _uiState.value = AuthUiState()
        }
    }

    fun updateConsent(consent: Boolean) {
        viewModelScope.launch {
            authRepository.updateConsent(consent)
        }
    }
}

class SalonViewModel(
    private val salonRepository: SalonRepository
) : ViewModel() {

    val treatments: StateFlow<List<Treatment>> = salonRepository.getTreatments()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val artisans: StateFlow<List<Artisan>> = salonRepository.getArtisans()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val products: StateFlow<List<Product>> = salonRepository.getProducts()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    val bookings: StateFlow<List<Booking>> = salonRepository.getBookings()
        .stateIn(viewModelScope, SharingStarted.WhileSubscribed(5000), emptyList())

    private val _selectedCategory = MutableStateFlow("All")
    val selectedCategory: StateFlow<String> = _selectedCategory.asStateFlow()

    fun setCategory(category: String) {
        _selectedCategory.value = category
    }

    fun cancelBooking(id: String) {
        viewModelScope.launch {
            salonRepository.cancelBooking(id)
        }
    }
}

data class BookingUiState(
    val selectedTreatment: Treatment? = null,
    val selectedArtisan: Artisan? = null,
    val date: String = "Tomorrow",
    val timeSlot: String = "11:30 AM",
    val guestName: String = "Riya Sharma",
    val guestPhone: String = "+91 98201 45890",
    val guestEmail: String = "salonapp826@gmail.com",
    val beverage: String = "Kashmiri Saffron Almond Kahwa",
    val aroma: String = "Pure Madurai Jasmine (Mogra)",
    val notes: String = "",
    val isConfirmed: Boolean = false,
    val confirmedBooking: Booking? = null
)

class BookingViewModel(
    private val salonRepository: SalonRepository
) : ViewModel() {

    private val _state = MutableStateFlow(BookingUiState())
    val state: StateFlow<BookingUiState> = _state.asStateFlow()

    fun setTreatment(treatment: Treatment) {
        _state.value = _state.value.copy(selectedTreatment = treatment)
    }

    fun setArtisan(artisan: Artisan) {
        _state.value = _state.value.copy(selectedArtisan = artisan)
    }

    fun updateDetails(
        date: String,
        timeSlot: String,
        name: String,
        phone: String,
        email: String,
        beverage: String,
        aroma: String,
        notes: String
    ) {
        _state.value = _state.value.copy(
            date = date,
            timeSlot = timeSlot,
            guestName = name,
            guestPhone = phone,
            guestEmail = email,
            beverage = beverage,
            aroma = aroma,
            notes = notes
        )
    }

    fun confirmBooking() {
        val s = _state.value
        val treatment = s.selectedTreatment ?: return
        val newBooking = Booking(
            id = "bk-" + System.currentTimeMillis(),
            bookingCode = "NX-" + (100000..999999).random(),
            treatmentId = treatment.id,
            treatmentTitle = treatment.title,
            artisanName = s.selectedArtisan?.name ?: "Dr. Rajeshwar Sharma",
            sanctuaryCity = "Mumbai (Bandra West)",
            date = s.date,
            timeSlot = s.timeSlot,
            guestName = s.guestName,
            guestPhone = s.guestPhone,
            guestEmail = s.guestEmail,
            beverageChoice = s.beverage,
            aromaPreference = s.aroma,
            notes = s.notes,
            totalPriceINR = treatment.priceINR,
            status = "Confirmed",
            createdAt = System.currentTimeMillis().toString()
        )

        viewModelScope.launch {
            salonRepository.createBooking(newBooking).onSuccess {
                _state.value = _state.value.copy(isConfirmed = true, confirmedBooking = it)
            }
        }
    }

    fun reset() {
        _state.value = BookingUiState()
    }
}
