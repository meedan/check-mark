require 'selenium-webdriver'
require 'yaml'
require 'net/http'
require 'json'
require 'httparty'

shared_examples 'tests' do
  it 'should open extension' do
    open_extension
    message = get_element('#title span')
    expect(message.text.include?('Add to Check')).to be(true)
  end

  it 'should localize' do
    open_browser 'pt'
    open_extension
    message = get_element('#title span')
    expect(message.text.include?('Adicionar ao Check')).to be(true)
    open_browser 'en'
  end

  it 'should login' do
    login
  end

  it 'should create media' do
    login
    sleep 2
    expect(@driver.page_source.include?('Claim: Test')).to be(true)
    expect(@driver.page_source.include?('Link: ')).to be(false)
    get_element('.Select-arrow').click
    sleep 3
    get_element('.Select-option').click
    sleep 1
    expect(@driver.page_source.include?('Saved')).to be(false)
    get_element('#button > div').click
    sleep 10
    expect(@driver.page_source.include?('Saved')).to be(true)
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

  def get_element(selector, visible = true)
    wait = Selenium::WebDriver::Wait.new(timeout: 5)
    wait.until {
      element = @driver.find_element(:css, selector)
      element if visible && element.displayed?
    }
  end

  def request_api(path, params)
    require 'net/http'
    uri = URI("#{@config['check_api_url']}/test/#{path}")
    uri.query = URI.encode_www_form(params)
    Net::HTTP.get_response(uri)
  end

  def login
    # Create user and confirm account
    email = "test-#{Time.now.to_i}@test.com"
    user = request_api 'user', { name: 'Test', email: email, password: '12345678', password_confirmation: '12345678', provider: '' }
    request_api 'confirm_user', { email: email }

    # Open extension and assert that the user is not logged in
    open_extension
    sleep 5
    expect(@driver.window_handles.size == 1).to be(true)
    expect(@driver.page_source.include?('sign in')).to be(true)

    # Click on "sign in" and make sure that a new window is opened
    get_element('#button > div').click
    sleep 3
    expect(@driver.window_handles.size == 2).to be(true)
    window = @driver.window_handles.last
    @driver.switch_to.window(window)

    # Login, create a team and create a project
    @driver.navigate.to "#{@config['check_api_url']}/test/session?email=#{email}"
    team = request_api 'team', { name: "Test Team #{Time.now.to_i}", email: email }
    team_id = JSON.parse(team.body)['data']['dbid']
    project = request_api 'project', { title: "Test Project #{Time.now.to_i}", team_id: team_id }
    @driver.close if @driver.respond_to?(:close)

    # Go back to the extension and make sure that user is logged in
    window = @driver.window_handles.first
    @driver.switch_to.window(window)
    @driver.navigate.refresh
    sleep 3
    expect(@driver.page_source.include?('sign in')).to be(false)
  end

  def save_screenshot(title)
    if @config['imgur_client_id']
      path = '/tmp/' + (0...8).map{ (65 + rand(26)).chr }.join + '.png'
      @driver.save_screenshot(path)

      auth_header =  {'Authorization' => 'Client-ID ' + @config['imgur_client_id']}
      image = File.new(path)
      body = { image: image, type: 'file' }
      response = HTTParty.post('https://api.imgur.com/3/upload', body: body, headers: auth_header)
      JSON.parse(response.body)['data']['link']
    end
  end

  def close_browser
    begin
      @driver.quit
    rescue
    end
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
      sleep 3
    end

    def open_extension
      @driver.navigate.to 'about:debugging'
      id = get_element('.internal-uuid span')
      @driver.navigate.to "moz-extension://#{id.text}/popup.html?text=Test"
      get_element('#app')
    end
    
    include_examples 'tests'
  end

  context 'chrome' do
    def open_browser(language = 'en')
      close_browser
      prefs = { 'intl.accept_languages' => language }
      path = @config['extension_path']
      args = ["disable-gpu", "no-sandbox", "disable-dev-shm-usage", "--load-extension=#{path}"]
      chrome_options = {
        prefs: prefs,
        args: args
      }
      desired_capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
        'goog:chromeOptions': chrome_options,
      )
      @driver = Selenium::WebDriver.for(:chrome, desired_capabilities: desired_capabilities, url: @config['chromedriver_url'])
    end

    def open_extension
      @driver.navigate.to 'chrome://extensions'
      sleep 1
      @driver.execute_script("document.getElementsByTagName('extensions-manager')[0].shadowRoot.querySelector('extensions-toolbar').shadowRoot.querySelector('#devMode').click()")
      sleep 1
      id = @driver.execute_script("return document.getElementsByTagName('extensions-manager')[0].shadowRoot.querySelector('#items-list').shadowRoot.querySelector('extensions-item').getAttribute('id')")
      @driver.navigate.to "chrome-extension://#{id}/popup.html?text=Test"
      sleep 5
      get_element('#app')
    end

    include_examples 'tests'
  end
end
