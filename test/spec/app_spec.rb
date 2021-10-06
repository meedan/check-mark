require 'selenium-webdriver'
require 'yaml'
require 'net/http'
require 'json'
require 'httparty'
require_relative './app_spec_helpers'
require_relative './data_field_spec_helpers'

shared_examples 'tests' do
  include AppSpecHelpers
  include DataFieldSpecHelpers

  it 'should open extension' do
    open_extension('text', 'Test')
    expect(@driver.page_source.include?('Sign In')).to be(true)
    expect(@driver.page_source.include?('Iniciar uma sessão')).to be(false)
  end

  it 'should localize' do
    open_browser 'pt'
    open_extension('text', 'Test')
    expect(@driver.page_source.include?('Sign In')).to be(false)
    expect(@driver.page_source.include?('Iniciar sessão')).to be(true)
    open_browser 'en'
  end

  it 'should login' do
    # Create user and confirm account
    email = "test-#{Time.now.to_i}@test.com"
    request_api 'user', { name: 'Test', email: email, password: '12345678', password_confirmation: '12345678', provider: '' }
    request_api 'confirm_user', { email: email }

    # Open extension and assert that the user is not logged in
    open_extension('text', 'Test')
    expect(@driver.window_handles.size == 1).to be(true)
    expect(@driver.page_source.include?('sign in')).to be(true)

    # Click on "sign in" and make sure that a new window is opened
    wait_for_selector('#login-button').click
    sleep 3
    expect(@driver.window_handles.size == 2).to be(true)
    window = @driver.window_handles.last
    @driver.switch_to.window(window)

    # Login, create a team and create a project
    @driver.navigate.to "#{@config['check_api_url']}/test/session?email=#{email}"
    team = request_api 'team', { name: "Test Team #{Time.now.to_i}", email: email }
    team_id = JSON.parse(team.body)['data']['dbid']
    request_api 'project', { title: "Test Project #{Time.now.to_i}", team_id: team_id }
    @driver.close if @driver.respond_to?(:close)

    # Go back to the extension and make sure that user is logged in
    window = @driver.window_handles.first
    @driver.switch_to.window(window)
    @driver.navigate.refresh
    wait_for_selector('#save-button')
    expect(@driver.page_source.include?('sign in')).to be(false)
  end

  it 'should create media555' do
    login(media_type: 'url', media_content: @media_url)
    wait_for_selector("//span[contains(text(), 'Link URL')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(false)
    # sleep 10
    wait_for_selector('#save-button').click
    wait_for_selector('#media')
    expect(@driver.page_source.include?('Saved!')).to be(true)
    expect(@driver.page_source.include?('Title')).to be(true)
    expect(@driver.page_source.include?('Author')).to be(true)
    expect(@driver.page_source.include?(@media_url)).to be(true)
    # verify that the team doesn't have task and metadata
    @driver.switch_to.default_content
    wait_for_selector("//span[contains(text(), 'Tasks')]", :xpath).click
    @driver.switch_to.frame 'check-web-frame'
    wait_for_selector("//span[contains(text(), 'No tasks')]", :xpath)
    expect(@driver.page_source.include?('No tasks')).to be(true)
    @driver.switch_to.default_content
    wait_for_selector("//span[contains(text(), 'Annotation')]", :xpath).click
    wait_for_selector("//span[contains(text(), 'No metadata fields')]", :xpath)
    expect(@driver.page_source.include?('No metadata fields')).to be(true)
  end

  it 'should create media from a profile URL' do
    login(media_type: 'url', media_content: @profile_url)
    wait_for_selector("//span[contains(text(), 'Link URL')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(false)
    wait_for_selector('#save-button').click
    wait_for_selector('#media')
    expect(@driver.page_source.include?(@profile_url)).to be(true)
    expect(@driver.page_source.include?('Title')).to be(true)
  end

  it 'should manage a team task' do
    login(media_type: 'text', media_content: 'Test', data_field_name: 'tasks')
    wait_for_selector("//span[contains(text(), 'Text claim')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(false)
    wait_for_selector('#save-button').click
    wait_for_selector("//p[contains(text(), 'Saved')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(true)
    wait_for_selector("//span[contains(text(), 'Tasks')]", :xpath).click
    @driver.switch_to.frame 'check-web-frame'
    wait_for_selector('#task__response-input')
    expect(@driver.page_source.include?('Team-task')).to be(true)
    # Answer task
    answer_data_field('answer')
    wait_for_selector("//span[contains(text(), 'Completed by')]", :xpath)
    expect(@driver.page_source.include?('Completed by')).to be(true)
    expect(@driver.page_source.include?('answer')).to be(true)
    # Edit task answer
    edit_data_field_response('-edited')
    expect(@driver.page_source.include?('answer-edited')).to be(true)
    # Delete task answer
    delete_data_field_response
    expect(@driver.page_source.include?('answer-edited')).to be(false)
    # delete task
    delete_data_field
    expect(@driver.page_source.include?('Team-task')).to be(false)
    expect(@driver.page_source.include?('No tasks')).to be(true)
  end

  it 'should add, edit and delete a metadata response' do
    login(media_type: 'text', media_content: 'Test', data_field_name: 'metadata')
    wait_for_selector("//span[contains(text(), 'Text claim')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(false)
    wait_for_selector('#save-button').click
    wait_for_selector("//p[contains(text(), 'Saved')]", :xpath)
    expect(@driver.page_source.include?('Saved!')).to be(true)

    wait_for_selector("//span[contains(text(), 'Annotation')]", :xpath).click
    wait_for_selector('#metadata-input')
    expect(@driver.page_source.include?('Team-metadata')).to be(true)
    # answer the metadata
    answer_data_field_metadata('answer')
    expect(@driver.page_source.include?('answer')).to be(true)
    # edit response
    edit_data_field_response_metadata('-edited')
    expect(@driver.page_source.include?('answer-edited')).to be(true)
    # delete response
    delete_data_field_response_metadata
    expect(@driver.page_source.include?('answer-edited')).to be(false)
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

  after :each do |example|
    if example.exception
      link = save_screenshot("Test failed: #{example.description}")
      puts "[Test #{example.description} failed! Check screenshot at #{link}]"
    end
    close_browser
  end

  context 'firefox' do
    before :all do
      `cd #{@config['extension_path']} && zip -r -FS #{@config['extension_path']}/test.xpi * && cd -`
      @profile_url = 'https://twitter.com/nytimes'
      @media_url = 'https://edition.cnn.com'
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
      uri = URI("#{bridge.http.send(:server_url)}session/#{bridge.session_id}/moz/addon/install")
      http = Net::HTTP.new(uri.host, uri.port)
      req = Net::HTTP::Post.new(uri.path, 'Content-Type' => 'application/json')
      req.body = { path: "#{@config['extension_path']}/test.xpi", temporary: true }.to_json
      http.request(req)
      sleep 3
    end

    def open_extension(type, content)
      @driver.navigate.to 'about:debugging'
      id = wait_for_selector('.internal-uuid span')
      @driver.navigate.to "moz-extension://#{id.text}/popup.html?#{type}=#{content}"
      wait_for_selector('#app')
    end

    include_examples 'tests'
  end

  context 'chrome' do
    before :all do
      @profile_url = 'https://twitter.com/meedan'
      @media_url = 'https://www.bbc.co.uk/'
    end

    def open_browser(language = 'en')
      close_browser
      prefs = { 'intl.accept_languages' => language }
      path = @config['extension_path']
      args = ['disable-gpu', 'no-sandbox', 'disable-dev-shm-usage', "--load-extension=#{path}"]
      chrome_options = {
        prefs: prefs,
        args: args
      }
      desired_capabilities = Selenium::WebDriver::Remote::Capabilities.chrome(
        'goog:chromeOptions': chrome_options
      )
      @driver = Selenium::WebDriver.for(:chrome, desired_capabilities: desired_capabilities, url: @config['chromedriver_url'])
    end

    def open_extension(type, content)
      @driver.navigate.to 'chrome://extensions'
      sleep 1
      @driver.execute_script("document.getElementsByTagName('extensions-manager')[0].shadowRoot.querySelector('extensions-toolbar').shadowRoot.querySelector('#devMode').click()")
      sleep 1
      id = @driver.execute_script("return document.getElementsByTagName('extensions-manager')[0].shadowRoot.querySelector('#items-list').shadowRoot.querySelector('extensions-item').getAttribute('id')")
      @driver.navigate.to "chrome-extension://#{id}/popup.html?#{type}=#{content}"
      wait_for_selector('#app')
    end

    include_examples 'tests'
  end
end
