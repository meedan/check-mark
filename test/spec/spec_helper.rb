require 'rspec/retry'

RSpec.configure do |config|
  config.default_retry_count = 3
  config.default_sleep_interval = 1
  config.verbose_retry = true
  config.expect_with :rspec do |expectations|
    expectations.include_chain_clauses_in_custom_matcher_descriptions = true
  end

  config.mock_with :rspec do |mocks|
    mocks.verify_partial_doubles = true
  end
end
