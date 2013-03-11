#!/usr/bin/env ruby
require 'rubygems'
require 'set'
require 'json'

dictfile = ARGV[0] || "/usr/share/dict/words"
unless File.readable? dictfile
	STDERR.puts "Unable to read dictionary file #{dictfile}"
	exit -1
end

File.open(ARGV[1] || 'words.json', 'w') do |f|
	f.puts JSON.dump( Set.new( File.read(dictfile).downcase.scan(/\w+/) ).to_a )
end
