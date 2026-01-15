class Student::PlaygroundController < ApplicationController
  def index
    render inertia: "Student/Playground/Index"
  end
end
