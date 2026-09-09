source "https://rubygems.org"

# The gem GitHub Pages runs. Pinning to it rather than to `jekyll` directly keeps a
# local preview on the same Jekyll and plugin versions as production.
#   bundle install
#   bundle exec jekyll serve
gem "github-pages", group: :jekyll_plugins

# Windows and JRuby do not ship a zoneinfo database.
platforms :mingw, :x64_mingw, :mswin, :jruby do
  gem "tzinfo", ">= 1", "< 3"
  gem "tzinfo-data"
end

# Speeds up file watching on Windows.
gem "wdm", "~> 0.1", platforms: [:mingw, :x64_mingw, :mswin]
