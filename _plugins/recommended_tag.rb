class RecommendedTag < Liquid::Tag
  def initialize(tag_name, input, tokens)
    super
    @tag_name = tag_name
    @input = input
  end

  # Lookup allows access to the page/post variables through the tag context
  def lookup(context, name)
    lookup = context
    name.split(".").each { |value| lookup = lookup[value] }
    lookup
  end

  def render(context)

    # Accessing the page/site variable for the base url
    baseurl = "#{lookup(context, 'site.baseurl')}"

    # Reading the tag parameter (using the pipe-split technique)
    input_split = split_params(@input)
    img_path = input_split[0].strip.downcase
    # Caption is an optional second parameter
    if( input_split.length > 1 )
      caption = input_split[1].strip
    end

    # Create the HTML output for the image container with an optional caption
    # the 'captioned-image' css class controls the look and feel of the image
    # in my case the class centeres the image and poses maximum size restrictions
    output =  "<div class=\"\"><div>"
    output += "<img alt=\"#{caption}\">"
    if( !caption.nil? && !caption.empty? )
      output += "<p>#{caption}</p>"
    end
    output += "</div></div>"

    return output
  end

  def split_params(params)
    params.split("|")
  end
end

Liquid::Template.register_tag('recommended_box', RecommendedTag)
Liquid::Template.register_tag('recommended_bar', RecommendedTag)
