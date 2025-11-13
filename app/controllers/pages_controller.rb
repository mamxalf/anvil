class PagesController < ApplicationController
  def home
    render inertia: "Home/Index", props: {
      message: "Hello from Inertia + React + TypeScript!"
    }
  end
end
