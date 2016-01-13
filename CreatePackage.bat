@echo off
set /p version="Enter Version: "

ECHO Building for android 
cordova build --release android

ECHO signing the apk
C:\Program Files\Java\jdk1.7.0_79\bin\jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\Work\Projects\Nix_Docs\my-release-key.keystore C:\Work\Projects\Nix\platforms\android\build\outputs\apk\android-release-unsigned.apk alias_name

ECHO zipalign
C:\Users\rajeshg\AppData\Local\Android\sdk1\build-tools\23.0.1\zipalign -v 4 C:\Work\Projects\Nix\platforms\android\build\outputs\apk\android-release-unsigned.apk C:\Work\Projects\Nix_Docs\nixv%version%.apk


ECHO Package ready for distribution.

email the package 
REM C:\Work\Tools\blat\full\blat -to rajeshgande@gmail.com -server smtp.omnicell.com -f batch_script@example.com -subject "subject" -body "body"
