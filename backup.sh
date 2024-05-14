sudo rm -rf ./config/
sudo rm -rf ./fonts
mkdir ./config
mkdir ./fonts
cp -rT ~/.config/ ./config
cp -rT ~/.fonts ./fonts
git add .
git commit -m "Backup Done"
echo "Backup done"
git push
