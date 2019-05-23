@echo off

git submodule foreach git add .
git submodule foreach git commit -m "^p^"
git submodule foreach git push

git add .
git commit -m "^p^"
git push

echo Done!
pause>nul