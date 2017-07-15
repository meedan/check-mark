require 'selenium-webdriver'
require 'yaml'
require 'net/http'
require 'json'

describe 'app' do

  @driver = @config = @prefs = nil

  before :each do
    @config = YAML.load_file('config.yml')
  end

  def get_element(selector)
    wait = Selenium::WebDriver::Wait.new(timeout: 5)
    wait.until {
      element = @driver.find_element(:css, selector)
      element if element.displayed?
    }
  end

  context "firefox" do

    before :all do
      `cd ../build && zip -r -FS /tmp/test.xpi * && cd -`
    end

    after :all do
      `rm -f /tmp/test.xpi`
    end

    before :each do
      caps = Selenium::WebDriver::Remote::Capabilities.firefox(marionette: true)
      profile = Selenium::WebDriver::Firefox::Profile.new
      profile['ui.popup.disable_autohide'] = true
      @driver = Selenium::WebDriver.for(:firefox, desired_capabilities: caps, profile: profile)
      
      bridge = @driver.send(:bridge)
      uri = URI(bridge.http.send(:server_url).to_s + 'session/' + bridge.session_id + '/moz/addon/install')
      http = Net::HTTP.new(uri.host, uri.port)
      req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
      req.body = { path: '/tmp/test.xpi', temporary: true }.to_json
      res = http.request(req)
      puts 'Tried to install extension, here is the response from geckodriver: ' + res.body
    end

    after :each do
      @driver.close
    end

    def open_extension
      @driver.navigate.to 'about:debugging'
      get_element('#enable-addon-debugging').click
      sleep 1
      @driver.action.key_down(:control).key_down(:shift).send_keys('l').key_up(:shift).key_up(:control).perform
      sleep 5
      get_element('.debug-button').click
      sleep 5
      @driver.switch_to.alert.accept
      sleep 5
    end

    it "should open extension" do
      open_extension
    end

    it "should localize" do
      # TODO
    end
  end

  context "chrome" do
    before :each do
      @prefs = { 'intl.accept_languages': 'en' }
      @driver = Selenium::WebDriver.for :chrome, switches: ['--load-extension=../build'], prefs: @prefs
    end

    after :each do
      @driver.quit
    end

    def open_extension
      @driver.action.key_down(:control).key_down(:shift).send_keys('l').key_up(:shift).key_up(:control).perform
      sleep 5
      window = @driver.window_handles.last
      @driver.switch_to.window(window)
      get_element('#app')
    end

    it "should open extension" do
      open_extension
      message = get_element('#app h2')
      expect(message.text.include?('Add to Check')).to be(true)
    end

    it "should localize" do
      @prefs['intl.accept_languages'] = 'pt'
      @driver = Selenium::WebDriver.for :chrome, switches: ['--load-extension=../build'], prefs: @prefs
      open_extension
      message = get_element('#app h2')
      expect(message.text.include?('Adicionar ao Check')).to be(true)
      @prefs['intl.accept_languages'] = 'en'
      @driver = Selenium::WebDriver.for :chrome, switches: ['--load-extension=../build'], prefs: @prefs
    end
  end
end
