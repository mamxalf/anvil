class Student::PlaygroundController < ApplicationController
  def index
    render inertia: "Student/Playground/Index"
  end

  def maze
    render inertia: "Student/Playground/Maze"
  end
end
