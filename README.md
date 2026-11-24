## mobile-app-book

Book app is a mobile application for Android and iOS platforms built by Anh Tester to Test Automation on mobile.

Web UI: https://book.anhtester.com/

API: https://book.anhtester.com/swagger

Tổng hợp mobile-app-demo: https://github.com/anhtester/mobile-app-demo

---

App "Book Anhtester" (quản lý sách, user, khuyến mãi, thể loại, giỏ hàng, đơn hàng) dùng để thực hành kiểm thử UI và mobile (Appium). App là **Hybrid**: giao diện React 19 + Vite + MUI chạy trong WebView, đóng gói Android/iOS bằng **Capacitor 7** (`appId: com.anhtester.book`). Bản build gọi API production `https://book.anhtester.com`.
## Mục lục

1. [Yêu cầu](#1-yêu-cầu)
2. [Clone và cài thư viện](#2-clone-và-cài-thư-viện)
3. [Build và chạy trên Android](#3-build-và-chạy-trên-android)
4. [Build và chạy trên iPhone (macOS)](#4-build-và-chạy-trên-iphone-macos)
5. [Gợi ý cho Appium](#5-gợi-ý-cho-appium)
6. [Lỗi thường gặp](#6-lỗi-thường-gặp)

## 1. Yêu cầu

| Công cụ | Dùng cho | Ghi chú |
|---|---|---|
| [Git](https://git-scm.com) | Clone repo | |
| [Bun](https://bun.sh) | Cài thư viện, chạy mọi script | Windows: `powershell -c "irm bun.sh/install.ps1 \| iex"`; macOS/Linux: `curl -fsSL https://bun.sh/install \| bash`. Cài xong **mở lại terminal** |
| JDK **21** | Build APK | Capacitor 7 bắt buộc JDK 21 (JDK 17 báo `invalid source release: 21`) |
| Android Studio + Android SDK | Build APK, emulator, `adb` | Đặt biến môi trường `ANDROID_HOME` (VD `C:\Users\<user>\AppData\Local\Android\Sdk`), thêm `platform-tools` và `emulator` vào `PATH` |
| macOS + Xcode + CocoaPods | Build iOS | Chỉ build iOS được trên Mac |

Kiểm nhanh:

```powershell
bun --version
```

```powershell
java -version
```

```powershell
adb version
```

## 2. Clone và cài thư viện

```powershell
git clone https://github.com/anhtester/mobile-app-book.git
```

```powershell
cd mobile-app-book; bun install
```

## 3. Build và chạy trên Android

### 3.1 Bật emulator (hoặc cắm điện thoại thật)

Tạo máy ảo trong Android Studio (*Device Manager → Create Virtual Device*), rồi bật từ Android Studio hoặc bằng lệnh (thay `<tên AVD>`):

```powershell
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd <tên AVD>
```

Điện thoại thật: bật *Tuỳ chọn nhà phát triển → Gỡ lỗi USB* rồi cắm cáp. Lệnh dưới phải liệt kê được thiết bị:

```powershell
adb devices
```

### 3.2 Build web + đồng bộ sang Android

```powershell
bun run build:android
```

Lệnh này chạy `vite build` (ra thư mục `dist/`) rồi `cap sync android` (chép `dist/` vào project Android).

Build dừng nếu code có lỗi ESLint hoặc TypeScript (do `vite-plugin-checker`). Kiểm trước bằng:

```powershell
bunx eslint "src/**/*.{ts,tsx}"; bunx tsc --noEmit
```

### 3.3 Cách nhanh: bản debug

```powershell
cd android; .\gradlew.bat assembleDebug; cd ..
```

```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

Bản debug có package `com.anhtester.book.local`, tên **Book Local**, icon nền cam, nên cài **cạnh** bản production mà không đè lên nhau. Mở app:

```powershell
adb shell am start -n com.anhtester.book.local/com.anhtester.book.MainActivity
```

### 3.4 Bản release (package `com.anhtester.book`)

```powershell
cd android; .\gradlew.bat assembleRelease; cd ..
```

File ra là `android\app\build\outputs\apk\release\app-release-unsigned.apk`, phải ký mới cài được. Ký bằng debug keystore có sẵn trên máy đã cài Android Studio (build-tools `36.0.0`, đổi theo phiên bản máy bạn có trong `%ANDROID_HOME%\build-tools`):

```powershell
$bt = "$env:ANDROID_HOME\build-tools\36.0.0"; & "$bt\zipalign.exe" -p -f 4 android\app\build\outputs\apk\release\app-release-unsigned.apk book-release.apk; & "$bt\apksigner.bat" sign --ks "$env:USERPROFILE\.android\debug.keystore" --ks-pass pass:android --key-pass pass:android --ks-key-alias androiddebugkey book-release.apk
```

```powershell
adb install -r book-release.apk
```

```powershell
adb shell am start -n com.anhtester.book/.MainActivity
```

Bản ký bằng debug keystore **không** đưa lên Google Play được; phát hành thật cần tạo keystore riêng và khai `signingConfigs.release` trong `android/app/build.gradle`.

> macOS/Linux: dùng `./gradlew` thay `.\gradlew.bat`, đường dẫn dùng `/`.

### 3.5 Mở bằng Android Studio (tuỳ chọn)

```powershell
bunx cap open android
```

Chọn thiết bị rồi bấm **Run** là Android Studio tự build và cài bản debug.

## 4. Build và chạy trên iPhone (macOS)

Chỉ làm được trên Mac có Xcode, Command Line Tools (`xcode-select --install`), CocoaPods (`brew install cocoapods`) và Bun.

```bash
bun install                  # bắt buộc trước pod install: Podfile trỏ vào node_modules
bun run build:ios            # vite build + cap sync ios
cd ios/App && pod install && cd ../..
bunx cap open ios            # mở ios/App/App.xcworkspace (KHÔNG mở .xcodeproj)
```

Trong Xcode: target **App** → *Signing & Capabilities* → chọn **Team**, đổi Bundle Identifier nếu Apple ID của bạn báo trùng → chọn simulator hoặc iPhone → **Run**.

- iPhone thật lần đầu: bật **Developer Mode** (Cài đặt → Quyền riêng tư & Bảo mật). Dùng Apple ID miễn phí thì vào Cài đặt → Cài đặt chung → Quản lý VPN & thiết bị → tin cậy chứng chỉ nhà phát triển (app chạy được 7 ngày).
- Sửa code xong: chạy lại `bun run build:ios` rồi Run (chỉ cần `pod install` lại khi thêm/đổi plugin Capacitor).
- Menu "Exit app" chỉ có trên Android (Apple không cho app tự thoát).

## 5. Gợi ý cho Appium

| | Bản release | Bản debug |
|---|---|---|
| `appium:appPackage` | `com.anhtester.book` | `com.anhtester.book.local` |
| `appium:appActivity` | `.MainActivity` | `com.anhtester.book.MainActivity` |
| `appium:automationName` | `UiAutomator2` | `UiAutomator2` |

iOS: `appium:automationName` = `XCUITest`, `appium:bundleId` = `com.anhtester.book`.

**Locator:** app là WebView nhưng `id` của thẻ HTML hiện ra thành `resource-id` trong cây native, `aria-label` thành `content-desc`, nên không cần đổi context sang `WEBVIEW_*`. `resource-id` này **không có tiền tố package**, vì vậy `AppiumBy.id("...")` (tự thêm `com.anhtester.book:id/`) **không tìm thấy**. Dùng:

```java
driver.findElement(AppiumBy.androidUIAutomator(
    "new UiSelector().resourceId(\"bottom-nav-book-management\")"));
```

App có 2 ngôn ngữ (vi/en): `id` không đổi theo ngôn ngữ, còn chữ hiển thị và `content-desc` thì đổi, nên ưu tiên locator theo `resource-id`.

## 6. Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `bun: command not found` sau khi cài | Mở lại terminal / editor để nhận `PATH` mới (`%USERPROFILE%\.bun\bin`) |
| `invalid source release: 21` | `JAVA_HOME` đang trỏ JDK 17, đổi sang JDK 21 |
| `SDK location not found` | Chưa đặt `ANDROID_HOME`, hoặc tạo `android/local.properties` với dòng `sdk.dir=<đường dẫn SDK>` (Windows viết `\\`) |
| `Unable to establish loopback connection` khi chạy Gradle (Windows) | Đường dẫn TEMP quá dài: tạo thư mục `C:\gtmp` rồi `$env:TEMP='C:\gtmp'; $env:TMP='C:\gtmp'; $env:JAVA_TOOL_OPTIONS='-Djdk.net.unixdomain.tmpdir=C:\gtmp'` |
| `cap sync` báo thiếu web assets | Chưa có `dist/`: chạy `bun run build:android` (không chạy riêng `cap sync`) |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Bản đang cài ký bằng key khác: `adb uninstall com.anhtester.book` (mất dữ liệu app) rồi cài lại |
| Git Bash: `adb shell ... /sdcard/...` bị đổi đường dẫn | Đặt `MSYS_NO_PATHCONV=1` trước lệnh, hoặc dùng PowerShell |

## License

[MIT](LICENSE)
