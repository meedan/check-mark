require 'selenium-webdriver'
require 'yaml'

describe 'bridge client' do

  @driver = @config = nil

  def open_extension
    @driver.action.key_down(:control).send_keys('b').key_up(:control).perform
    sleep 5
    window = @driver.window_handles.last
    @driver.switch_to.window(window)
    wait = Selenium::WebDriver::Wait.new(timeout: 100)
    wait.until {
      element = @driver.find_element(:css, '.orange-text')
      element if element.displayed?
    }
  end

  def twitter_login
    @driver.navigate.to 'https://twitter.com/login'
    wait = Selenium::WebDriver::Wait.new(timeout: 100)
    input = wait.until {
      element = @driver.find_element(:css, '.js-username-field')
      element if element.displayed?
    }
    input.send_keys(@config['twitter_user'])
    input = wait.until {
      element = @driver.find_element(:css, '.js-password-field')
      element if element.displayed?
    }
    input.send_keys(@config['twitter_password'])
    input = wait.until {
      element = @driver.find_element(:css, 'button')
      element if element.displayed?
    }
    input.click
    sleep 3
  end

  def twitter_auth
    open_extension
    @driver.find_element(:xpath, "//a[@id='twitter-login']").click
    sleep 5
    window = @driver.window_handles.first
    @driver.switch_to.window(window)
    open_extension
    @driver.find_element(:xpath, "//a[@id='twitter-login']").click
    sleep 1
  end

  def go_to_tweet
    @driver.navigate.to 'https://twitter.com/metaphorminute'
    wait = Selenium::WebDriver::Wait.new(timeout: 100)
    tweet = wait.until {
      element = @driver.find_element(:css, 'span._timestamp')
      element if element.displayed?
    }
    tweet.click
    wait.until {
      element = @driver.find_element(:css, 'body')
      element if element.displayed?
    }
  end

  before :each do
    @config = YAML.load_file('config.yml')

    Selenium::WebDriver::Chrome.driver_path = 'chromedriver'
  
    prefs = {
      extensions: {
        commands: {
          'linux:Ctrl+B' => {
            'command_name' => '_execute_browser_action',
            'extension' => 'mlhjofpecedoncmiagcopbhbaepadlpp',
            'global' => false
          }
        }
      }
    }
    
    @driver = Selenium::WebDriver.for :chrome, switches: ['--load-extension=../build/extension'], prefs: prefs
  end

  after :each do
    @driver.quit
  end

  context "chrome extension" do

    it "should translate tweet" do
      twitter_login
      go_to_tweet
      twitter_auth
      wait = Selenium::WebDriver::Wait.new(timeout: 100)
      translate = wait.until {
        element = @driver.find_element(:css, '#translate-post')
        element if element.displayed?
      }
      translate.click
      
      input = wait.until {
        element = @driver.find_element(:css, '#translation')
        element if element.displayed?
      }
      input.send_keys('Translation')
      input = wait.until {
        element = @driver.find_element(:css, '#annotation')
        element if element.displayed?
      }
      input.send_keys('Annotation')
      input = wait.until {
        @driver.find_element(:name, 'project')
      }
      @driver.execute_script("return document.forms[0].project.value = '5';")
      input = wait.until {
        @driver.find_element(:name, 'language')
      }
      @driver.execute_script("return document.forms[0].language.value = 'en_US';")
      input = wait.until {
        element = @driver.find_element(:css, '#submit')
        element if element.displayed?
      }
      input.click
      sleep 3
      message = wait.until {
        element = @driver.find_element(:css, 'h1')
        element if element.displayed?
      }
      expect(message.text.include?('Success')).to be(true)
    end

  end
end
