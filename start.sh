touch /tmp/INSTALLED_PACKAGES
PACKAGES="imagemagick ghostscript poppler-utils"
if [ ! "$PACKAGES" == "$(cat /tmp/INSTALLED_PACKAGES)" ]; then
  cd /tmp
  rm -rf notroot
  git clone https://github.com/CrazyPython/notroot
  source notroot/bashrc
  notroot install $PACKAGES
  echo $PACKAGES > /tmp/INSTALLED_PACKAGES
else
  source /tmp/notroot/bashrc
fi
cd
pnpm install --reporter silent --prefer-offline --audit false
npm run-script run --silent
#sed -i '/policy domain="coder" rights="none" pattern="PDF"/c\policy domain="coder" rights="read|write" pattern="PDF" ' /etc/ImageMagick-6/policy.xml
export MAGICK_CONFIGURE_PATH='/app/.config/ImageMagick/:/etc/ImageMagick-6/'