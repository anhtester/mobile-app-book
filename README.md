# Book Anhtester – App mobile

App mobile "Book Anhtester" (quản lý sách, user, khuyến mãi, thể loại, giỏ hàng, đơn hàng) dùng để thực hành kiểm thử UI và mobile (Appium). App là **Hybrid**: giao diện React 19 + Vite + MUI chạy trong WebView, đóng gói Android/iOS bằng **Capacitor 7** (`appId: com.anhtester.book`).

App là **client** của server ở repo anh em [`book.anhtester.com`](../book.anhtester.com) (backend Bun + Elysia + MySQL, kèm web UI). Hai repo đặt cạnh nhau trong cùng thư mục cha:

```
D:\book-web-api-mobile\
├── book.anhtester.com\         # server: backend (API, Swagger) + frontend web
└── mobile-book.anhtester.com\  # repo này: app mobile
```

## Mục lục

1. [Yêu cầu](#1-yêu-cầu)
2. [Chạy server local (backend + web UI)](#2-chạy-server-local-backend--web-ui)
3. [Chạy app mobile trên trình duyệt](#3-chạy-app-mobile-trên-trình-duyệt)
4. [Build và chạy trên Android](#4-build-và-chạy-trên-android)
5. [Build và chạy trên iPhone (macOS)](#5-build-và-chạy-trên-iphone-macos)
6. [Appium: `capabilities.json`](#6-appium-capabilitiesjson)
7. [Tài khoản test](#7-tài-khoản-test)
8. [Lỗi thường gặp](#8-lỗi-thường-gặp)

---

## 1. Yêu cầu

| Công cụ | Dùng cho | Ghi chú |
|---|---|---|
| [Bun](https://bun.sh) (đã chạy với 1.4.5) | Cài thư viện, chạy mọi script | Windows: `powershell -c "irm bun.sh/install.ps1 \| iex"`, cài xong **mở lại terminal** |
| MySQL 8 (hoặc MariaDB) | Database của backend | Máy Windows dùng MySQL của WAMP, user `root`, không mật khẩu, cổng 3306 |
| JDK **21** | Build APK | Capacitor 7 bắt buộc JDK 21 (JDK 17 báo `invalid source release: 21`) |
| Android Studio + Android SDK | Emulator, `adb`, build-tools | Đặt biến môi trường `ANDROID_HOME` (VD `C:\Users\<user>\AppData\Local\Android\Sdk`) và thêm `platform-tools`, `emulator` vào `PATH` |
| Node.js + Appium 3 (`npm i -g appium`, `appium driver install uiautomator2`) | Chạy test Appium | Không bắt buộc nếu chỉ chạy app |
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

## 2. Chạy server local (backend + web UI)

Làm trong repo server `..\book.anhtester.com`. Chi tiết đầy đủ ở README của repo đó.

### 2.1 Bật MySQL

- Có WAMP: bật WampServer (biểu tượng xanh là MySQL đã chạy).
- Không có quyền admin để bật service `wampmysqld64`: chạy thẳng tiến trình MySQL và để cửa sổ đó mở:

```powershell
& "C:\wamp64\bin\mysql\mysql8.4.13\bin\mysqld.exe" --defaults-file="C:\wamp64\bin\mysql\mysql8.4.13\my.ini" --console
```

Thấy dòng `ready for connections ... port: 3306` là xong.

### 2.2 Backend (lần đầu)

Tạo `backend\.env` từ `backend\.env.example`, điền `JWT_SECRET` là một chuỗi ngẫu nhiên dài:

```
PORT="4566"
JWT_SECRET="<chuỗi ngẫu nhiên dài>"
DATABASE_URL="mysql://root:@127.0.0.1:3306/book_anhtester"
EXPTOKEN="6d"
FILEDIR="upload"
```

Cài thư viện, tạo bảng và nạp dữ liệu mẫu (database `book_anhtester` tự được tạo):

```powershell
cd ..\book.anhtester.com\backend; bun install; bunx prisma generate; bunx prisma db push; bun run seed --yes
```

> ⚠️ `bun run seed --yes` **xoá toàn bộ dữ liệu** rồi nạp lại bộ mẫu (9 user, 40 sách, 9 thể loại, 7 khuyến mãi), chỉ giữ `admin@example.com`.

### 2.3 Chạy backend và web UI (mỗi lệnh một terminal)

```powershell
cd ..\book.anhtester.com\backend; bun run dev
```

```powershell
cd ..\book.anhtester.com\frontend; bun install; bun run dev
```

| Địa chỉ | Là gì |
|---|---|
| http://localhost:4566/api/... | API |
| http://localhost:4566/swagger | Tài liệu API (Scalar), gọi thử API ngay trên trang |
| http://localhost:3039 | Web UI, `/api` đi qua proxy sang 4566 |

## 3. Chạy app mobile trên trình duyệt

```powershell
bun install
```

```powershell
Copy-Item .env.example .env
```

```powershell
bun --bun vite --port 3040 --strictPort
```

Mở http://localhost:3040 (bật chế độ điện thoại trong DevTools để xem đúng giao diện). Dùng cổng **3040** vì 3039 đã là web UI của repo server.

`VITE_API_URL` trong `.env` quyết định app dev gọi đâu:

| `.env` | App dev gọi |
|---|---|
| `VITE_API_URL=` (rỗng, như `.env.example`) | `/api` tương đối, Vite proxy sang backend local `http://localhost:4566` |
| Không có dòng `VITE_API_URL` | Production `https://book.anhtester.com` |

> **Bản build (`build`, `build:android`, `build:ios`) luôn gọi production** `https://book.anhtester.com`, bỏ qua mọi `.env`. Muốn app trên điện thoại dùng backend local thì dùng chế độ live reload (mục 4.3).

Kiểm tra code trước khi build (build sẽ dừng nếu có lỗi ESLint hoặc TypeScript):

```powershell
bunx eslint "src/**/*.{ts,tsx}"; bunx tsc --noEmit
```

## 4. Build và chạy trên Android

### 4.1 Hai bản app cài cạnh nhau

| Bản | Package | Tên trên máy | Gọi tới | Build bằng |
|---|---|---|---|---|
| **local** (debug) | `com.anhtester.book.local` | Book Local | Web dev `http://10.0.2.2:3040` → proxy Vite → backend local 4566 | `sync:android:live` + `assembleDebug` |
| **production** (release) | `com.anhtester.book` | Book Anhtester | `https://book.anhtester.com` | `build:android` + `assembleRelease` |

Hai bản dùng chung file `android/app/src/main/assets/capacitor.config.json` do `cap sync` sinh ra, nên **lệnh sync phải chạy ngay trước lệnh Gradle tương ứng** (sync live rồi build release thì bản release cũng trỏ về `10.0.2.2`).

### 4.2 Bật emulator Pixel_10_Pro_XL

Tạo AVD trong Android Studio (Device Manager → Pixel 10 Pro XL, system image API 37 x86_64), đặt tên `Pixel_10_Pro_XL`. Bật:

```powershell
& "$env:ANDROID_HOME\emulator\emulator.exe" -avd Pixel_10_Pro_XL -no-snapshot-save -no-boot-anim
```

Chờ boot xong (lệnh dưới trả về `1`), máy lên là `emulator-5554`:

```powershell
adb shell getprop sys.boot_completed
```

Thông số máy đã kiểm: Android 17, màn hình 1344×2992, density 480 (1 dp = 3 px).

### 4.3 Bản local (live reload, dùng backend local)

Cần backend (mục 2) và app dev cổng 3040 (mục 3) đang chạy.

```powershell
bun run sync:android:live
```

```powershell
cd android; .\gradlew.bat assembleDebug; cd ..
```

```powershell
adb install -r android\app\build\outputs\apk\debug\app-debug.apk
```

```powershell
adb shell am start -n com.anhtester.book.local/com.anhtester.book.MainActivity
```

App mở web dev qua `10.0.2.2` (địa chỉ máy host nhìn từ emulator); sửa code trong `src/` là app tự tải lại. Dashboard hiện đúng số liệu DB local (VD 9 user, 40 sách) là đang dùng backend local.

> Lần sync đầu chưa có `dist/` thì `cap sync` báo thiếu web assets: chạy `bun run build` một lần, hoặc tạo `dist\index.html` rỗng (ở chế độ live, app không đọc file này).

### 4.4 Bản production (release)

```powershell
bun run build:android
```

```powershell
cd android; .\gradlew.bat assembleRelease; cd ..
```

File ra là `android\app\build\outputs\apk\release\app-release-unsigned.apk`. Repo chưa có keystore phát hành, muốn cài thử thì ký bằng debug keystore của máy (build-tools 36.0.0):

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

### 4.5 Mở bằng Android Studio (tuỳ chọn)

```powershell
bunx cap open android
```

## 5. Build và chạy trên iPhone (macOS)

Chỉ làm được trên Mac có Xcode, Command Line Tools (`xcode-select --install`), CocoaPods (`brew install cocoapods`) và Bun (`curl -fsSL https://bun.sh/install | bash`).

```bash
bun install                  # bắt buộc trước pod install: Podfile trỏ vào node_modules
bun run build:ios            # vite build (luôn gọi production) + cap sync ios
cd ios/App && pod install && cd ../..
bunx cap open ios            # mở ios/App/App.xcworkspace (KHÔNG mở .xcodeproj)
```

Trong Xcode: target **App** → *Signing & Capabilities* → chọn **Team**, giữ Bundle Identifier `com.anhtester.book` → chọn simulator hoặc iPhone → **Run**.

- iPhone thật lần đầu: bật **Developer Mode** (Cài đặt → Quyền riêng tư & Bảo mật). Dùng Apple ID miễn phí thì vào Cài đặt → Cài đặt chung → Quản lý VPN & thiết bị → tin cậy chứng chỉ nhà phát triển (app chạy được 7 ngày).
- Sửa code web xong: chạy lại `bun run build:ios` rồi Run (chỉ cần `pod install` lại khi thêm/đổi plugin Capacitor).
- Phát hành: *Product → Archive → Distribute App* (TestFlight / Ad Hoc), cần Apple Developer Program.
- Menu "Exit app" chỉ có trên Android (Apple không cho app tự thoát).

**Live reload với backend local trên iOS:** chạy backend + `bun run dev` (cổng 3040) trên Mac, rồi

```bash
bun run sync:ios:live                                   # simulator (localhost:3040)
CAP_LIVE_URL=http://<IP Mac trong LAN>:3040 bunx cap sync ios   # iPhone thật
```

Run lại từ Xcode. Quay về production: `bun run build:ios` rồi Run lại.

## 6. Appium: `capabilities.json`

| Khoá | Thiết bị | App | Dùng khi |
|---|---|---|---|
| `android-pixel` | Emulator `Pixel_10_Pro_XL` (Android 17) | `com.anhtester.book` (production) | PC Windows, test bản release |
| `android-pixel-local` | Emulator `Pixel_10_Pro_XL` (Android 17) | `com.anhtester.book.local` (backend local) | PC Windows, test bản live reload |
| `android` | Emulator `Medium_Phone` (`emulator-5554`) | `com.anhtester.book` | Máy có AVD `Medium_Phone` |
| `android-local` | Emulator `Medium_Phone` (`emulator-5554`) | `com.anhtester.book.local` | như trên |
| `ios` | iPhone / simulator (giá trị mẫu) | `com.anhtester.book` | Chỉ trên Mac, sửa `udid`, tên máy, phiên bản iOS theo máy thật |

Hai khoá `android-pixel*` dùng `appium:avd`: nếu emulator chưa bật, Appium tự bật AVD `Pixel_10_Pro_XL` (chờ tối đa 180 giây); nếu đã bật thì dùng luôn máy đó, không cần ghi `udid`. App phải được cài trước (mục 4) vì capability dùng `appPackage`/`appActivity` và `noReset: true`.

```powershell
appium --port 4723
```

**Locator:** app là WebView nhưng `id` của thẻ HTML hiện ra thành `resource-id` trong cây native, `aria-label` thành `content-desc`, nên không cần đổi context sang `WEBVIEW_*`. `resource-id` này **không có tiền tố package**, vì vậy chiến lược `AppiumBy.id("...")` (tự thêm `com.anhtester.book:id/`) **không tìm thấy**. Dùng:

```java
driver.findElement(AppiumBy.androidUIAutomator(
    "new UiSelector().resourceId(\"bottom-nav-book-management\")"));
```

Danh sách id: [`memory/notes/locators.md`](memory/notes/locators.md).

## 7. Tài khoản test

| Môi trường | Email | Mật khẩu |
|---|---|---|
| Local (sau khi seed) | `admin@example.com` | `123456` |
| Local | 8 user `*@example.com` khác (2 user bị khoá) | `123456` |

Chưa đăng nhập vẫn xem được danh sách (chế độ khách, chỉ thấy sách đang bán); thêm/sửa/xoá cần đăng nhập.

## 8. Lỗi thường gặp

| Lỗi | Cách xử lý |
|---|---|
| `bun: command not found` sau khi cài | Mở lại terminal / editor để nhận `PATH` mới (`%USERPROFILE%\.bun\bin`) |
| Backend báo không kết nối được DB | MySQL chưa chạy (mục 2.1) hoặc `DATABASE_URL` sai |
| `invalid source release: 21` | `JAVA_HOME` đang trỏ JDK 17, đổi sang JDK 21 |
| `Unable to establish loopback connection` khi chạy Gradle | Đường dẫn TEMP quá dài: `$env:TEMP='C:\gtmp'; $env:TMP='C:\gtmp'; $env:JAVA_TOOL_OPTIONS='-Djdk.net.unixdomain.tmpdir=C:\gtmp'` (tạo thư mục `C:\gtmp` trước) |
| App crash ngay khi mở, `ClassNotFoundException: ...MainActivity` | Thiếu `android/app/src/main/java/com/anhtester/book/MainActivity.java` (nội dung `public class MainActivity extends BridgeActivity {}`) |
| `INSTALL_FAILED_UPDATE_INCOMPATIBLE` | Bản đang cài ký bằng key khác: `adb uninstall com.anhtester.book` (mất dữ liệu app) rồi cài lại |
| App local trắng màn / không tải | Kiểm app dev cổng 3040 đang chạy; `android/app/src/main/assets/capacitor.config.json` phải có `server.url = http://10.0.2.2:3040` |
| Badge đỏ góc trái màn hình ở bản local | Overlay của `vite-plugin-checker` (lỗi ESLint/TS ở dev), không phải lỗi app |
| Console báo `401` / `Token refresh failed ... 422` khi chưa đăng nhập | Bình thường với khách (chưa có token, chưa có cookie refresh) |
| Git Bash: `adb shell ... /sdcard/...` bị đổi đường dẫn | Đặt `MSYS_NO_PATHCONV=1` trước lệnh, hoặc dùng PowerShell |
