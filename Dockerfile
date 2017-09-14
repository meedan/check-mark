FROM meedan/ruby
MAINTAINER Meedan <sysops@meedan.com>

# install dependencies
RUN apt-get update -qq && apt-get install -y zip autoconf automake libtool python-pip && rm -rf /var/lib/apt/lists/*

# node modules
ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/

# ruby gems
COPY test/Gemfile test/Gemfile.lock /app/test/
RUN cd /app/test && gem install bundler && bundle install --jobs 20 --retry 5

# watchman (relay-compiler dependency)
RUN git clone https://github.com/facebook/watchman.git /tmp/watchman && \
    cd /tmp/watchman && \
    git checkout v4.7.0 && \
    ./autogen.sh && \
    ./configure --without-python && \
    make && make install

# tx client
RUN pip install transifex-client

# install code
WORKDIR /app
COPY . /app

# compile
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["tini", "--"]
CMD ["/docker-entrypoint.sh"]
