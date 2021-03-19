FROM node:12.16.1-buster AS base
MAINTAINER Meedan <sysops@meedan.com>

# TODO develop our own `watchman` image, so we can version it
COPY --from=icalialabs/watchman:buster /usr/local/bin/watchman /usr/local/bin/watchman
RUN mkdir -p /usr/local/var/run/watchman && touch /usr/local/var/run/watchman/.not-empty

# install dependencies
RUN true \
    && apt-get update \
    && apt-get install -y --no-install-recommends \
        ruby2.5 \
        ruby2.5-dev \
        build-essential \
        graphicsmagick \
        python-pip \
        python-setuptools \
        python-wheel \
        tini \
        zip \
        libidn11-dev \
        libtag1-dev \
        libtool \
        libgconf-2-4 \
        xvfb \
        autoconf \
        automake \
    && gem install bundler:2.1.4 \
    && rm -rf /var/lib/apt/lists/*

# /app will be "." mounted as a volume mount from the host
WORKDIR /app

# ruby gems, for integration tests
# Gemfile.lock files must be updated on a host machine (outside of Docker)
COPY test/Gemfile test/Gemfile.lock /app/test/
RUN true \
    && cd /app/test \
    && BUNDLE_SILENCE_ROOT_WARNING=1 bundle install --jobs 20 --retry 5

# tx client
RUN pip install --upgrade transifex-client

# install code
COPY . /app
RUN ln -s /app /check-mark

# compile
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["tini", "--"]
CMD ["/docker-entrypoint.sh"]
