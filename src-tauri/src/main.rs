// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri_plugin_http;
fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_cors_fetch::init())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// use serde::Deserialize;
// use std::fs;

// #[derive(Deserialize)]
// struct ImageRequest {
//     url: String,
//     army_id: i32,
// }

// #[tauri::command]
// async fn load_army_image(request: ImageRequest) -> Result<String, String> {
//     // Здесь логика загрузки и кэширования изображения
//     // Возвращаем локальный путь к изображению
//     Ok(format!("local://army-images/{}.jpg", request.army_id))
// }
