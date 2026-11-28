@echo off
setlocal
cd /d "%~dp0"
set "MSG=%~1"
if not defined MSG set "MSG=Update site"

for /f "delims=" %%b in ('git branch --show-current') do set "BRANCH=%%b"
if not "%BRANCH%"=="main" (
  echo [STOP] Current branch is "%BRANCH%". Deploy only from main.
  exit /b 1
)

rem Upload only site files, project notes and changes to files git already tracks.
git add -u || goto :fail
git add -- index.html about.html contact.html privacy.html sitemap.xml robots.txt 404.html guides css js CLAUDE.md deploy.cmd .gitattributes || goto :fail
git diff --cached --quiet
if errorlevel 1 (git commit -m "%MSG%" || goto :fail)

rem main is the source. gh-pages follows it so GitHub Pages stays up to date.
git push --atomic origin main main:gh-pages || goto :fail
echo [OK] Pushed. The sites usually update within a few minutes.
exit /b 0

:fail
echo [FAIL] Deploy stopped. Read the message above.
exit /b 1
