class Student::PlaygroundController < ApplicationController
  def index
    render inertia: "Student/Playground/Index"
  end

  def maze
    render inertia: "Student/Playground/Maze"
  end

  def platformer
    render inertia: "Student/Playground/Platformer"
  end
end
