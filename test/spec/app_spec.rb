require 'selenium-webdriver'
require 'yaml'
require 'net/http'
require 'json'

shared_examples 'tests' do
  it 'should open extension' do
    open_extension
    message = get_element('#app h2')
    expect(message.text.include?('Add to Check')).to be(true)
  end

  it 'should localize' do
    open_browser 'pt'
    open_extension
    message = get_element('#app h2')
    expect(message.text.include?('Adicionar ao Check')).to be(true)
    open_browser 'en'
  end
end

describe 'app' do
  @driver = @config = nil

  before :all do
    @config = YAML.load_file('config.yml')
  end

  before :each do
    open_browser
  end

  after :each do
    close_browser
  end

  def get_element(selector)
    wait = Selenium::WebDriver::Wait.new(timeout: 5)
    wait.until {
      element = @driver.find_element(:css, selector)
      element if element.displayed?
    }
  end

  context 'firefox' do
    before :all do
      `cd #{@config['extension_path']} && zip -r -FS #{@config['extension_path']}/test.xpi * && cd -`
    end

    after :all do
      `rm -f #{@config['extension_path']}/test.xpi`
    end

    def open_browser(language = 'en')
      close_browser
      prefs = { 'intl.accept_languages' => language }
      caps = Selenium::WebDriver::Remote::Capabilities.firefox(marionette: true, 'moz:firefoxOptions' => { prefs: prefs })
      @driver = Selenium::WebDriver.for :remote, url: @config['geckodriver_url'], desired_capabilities: caps
      bridge = @driver.send(:bridge)
      uri = URI(bridge.http.send(:server_url).to_s + 'session/' + bridge.session_id + '/moz/addon/install')
      http = Net::HTTP.new(uri.host, uri.port)
      req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
      req.body = { path: "#{@config['extension_path']}/test.xpi", temporary: true }.to_json
      res = http.request(req)
      puts 'Tried to install extension, here is the response from geckodriver: ' + res.body
      sleep 3
    end

    def close_browser
      begin
        @driver.close
      rescue
      end
    end

    def open_extension
      # @driver.action.key_down(:control).key_down(:shift).send_keys('l').key_up(:shift).key_up(:control).perform
      # window = @driver.window_handles.last
      # @driver.switch_to.window(window)
      @driver.navigate.to 'about:debugging'
      id = get_element('.internal-uuid span')
      @driver.navigate.to "moz-extension://#{id.text}/popup.html"
      get_element('#app')
    end
    
    include_examples 'tests'
  end

  context 'chrome' do
    def open_browser(language = 'en')
      close_browser
      prefs = { 'intl.accept_languages' => language }
      path = @config['extension_path']
      caps = Selenium::WebDriver::Remote::Capabilities.chrome(chromeOptions: { args: ["--load-extension=#{path}"], prefs: prefs })
      @driver = Selenium::WebDriver.for :remote, url: @config['chromedriver_url'], desired_capabilities: caps
    end

    def close_browser
      begin
        @driver.quit
      rescue
      end
    end

    def open_extension
      # @driver.action.key_down(:control).key_down(:shift).send_keys('l').key_up(:shift).key_up(:control).perform
      # window = @driver.window_handles.last
      # @driver.switch_to.window(window)
      @driver.navigate.to 'chrome://extensions-frame'
      sleep 1
      get_element('#toggle-dev-on').click
      sleep 1
      id = get_element('.extension-id')
      @driver.navigate.to "chrome-extension://#{id.text}/popup.html"
      get_element('#app')
    end

    include_examples 'tests'
  end
end
