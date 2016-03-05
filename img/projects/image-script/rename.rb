filenames = Dir.glob("*")

filenames.each do |filename|
  if filename[".png-"]
    new_name= filename.gsub(".png", "")
    File.rename(filename, new_name)
  end

  if filename[".jpg-"]
    new_name= filename.gsub(".jpg-", "-")
    File.rename(filename, new_name)
  end

  if filename[".png.jpg"]
    new_name= filename.gsub(".png", "")
    File.rename(filename, new_name)
  end
end
