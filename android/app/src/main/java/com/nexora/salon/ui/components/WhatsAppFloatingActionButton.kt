package com.nexora.salon.ui.components

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Chat
import androidx.compose.material3.ExtendedFloatingActionButton
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import com.nexora.salon.ui.theme.NexoraWhatsApp
import java.net.URLEncoder

@Composable
fun WhatsAppFloatingActionButton(
    phoneNumber: String = "+919820145890",
    defaultMessage: String = "Namaste Nexora! Mujhe salon appointment book karni hai / I would like to enquire about appointment availability.",
    modifier: Modifier = Modifier
) {
    val context = LocalContext.current

    ExtendedFloatingActionButton(
        onClick = {
            openWhatsAppChat(context, phoneNumber, defaultMessage)
        },
        containerColor = NexoraWhatsApp,
        contentColor = androidx.compose.ui.graphics.Color.White,
        icon = {
            Icon(Icons.Filled.Chat, contentDescription = "WhatsApp Us")
        },
        text = {
            Text("WhatsApp Us", color = androidx.compose.ui.graphics.Color.White)
        },
        modifier = modifier.padding(16.dp)
    )
}

fun openWhatsAppChat(context: Context, phone: String, message: String) {
    val cleanPhone = phone.replace("+", "").replace(" ", "")
    val encodedMsg = URLEncoder.encode(message, "UTF-8")
    val url = "https://api.whatsapp.com/send?phone=$cleanPhone&text=$encodedMsg"

    val intent = Intent(Intent.ACTION_VIEW).apply {
        data = Uri.parse(url)
    }
    context.startActivity(intent)
}
