FROM selenium/standalone-firefox-debug

USER root

#=========
# Firefox
#=========
ARG FIREFOX_VERSION=95.0b9
RUN apt-get update -qqy \
  && apt-get -qqy --no-install-recommends install firefox \
  && apt-get -y purge firefox \
  && rm -rf /var/lib/apt/lists/* /var/cache/apt/* \
  && wget --no-hsts --no-verbose -O /tmp/firefox.tar.bz2 https://download-installer.cdn.mozilla.net/pub/firefox/releases/$FIREFOX_VERSION/linux-x86_64/en-US/firefox-$FIREFOX_VERSION.tar.bz2 \
  && rm -rf /opt/firefox \
  && tar -C /opt -xjf /tmp/firefox.tar.bz2 \
  && rm /tmp/firefox.tar.bz2 \
  && mv /opt/firefox /opt/firefox-$FIREFOX_VERSION \
  && chmod 755 /opt/firefox-$FIREFOX_VERSION\
  && ln -fs /opt/firefox-$FIREFOX_VERSION/firefox /usr/bin/firefox

#============
# GeckoDriver
#============
ARG GECKODRIVER_VERSION=0.29.1
RUN wget --no-hsts --no-verbose -O /tmp/geckodriver.tar.gz https://github.com/mozilla/geckodriver/releases/download/v$GECKODRIVER_VERSION/geckodriver-v$GECKODRIVER_VERSION-linux64.tar.gz \
  && rm -rf /opt/geckodriver \
  && tar -C /opt -zxf /tmp/geckodriver.tar.gz \
  && rm /tmp/geckodriver.tar.gz \
  && mv /opt/geckodriver /opt/geckodriver-$GECKODRIVER_VERSION \
  && chmod 755 /opt/geckodriver-$GECKODRIVER_VERSION \
  && rm /usr/bin/geckodriver \
  && ln -fs /opt/geckodriver-$GECKODRIVER_VERSION /usr/bin/geckodriver

#======
# Nginx
#======
RUN apt-get update -qq && apt-get install nginx --no-install-recommends -y
COPY ./nginx.conf /etc/nginx/nginx.conf
RUN rm /etc/nginx/sites-enabled/default

COPY entry_point.sh /opt/bin/entry_point.sh
RUN chmod +x /opt/bin/entry_point.sh
