FROM dynamicip-chrome-nodejs-base

ADD src /opt/dynamicip/scraping-example
ADD node_modules /opt/dynamicip/scraping-example/node_modules
ADD .dynamicip_api_key /opt/dynamicip/scraping-example
RUN cd /opt/dynamicip/scraping-example && \
    sudo sed -i -e "s/___APIKEY___/$(cat .dynamicip_api_key)/g" chrome_extension/authenticator.js && \
    sudo cp entrypoint.sh /opt/bin/entry_point.sh