package com.thetodolist.thetodolist.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class HomeController {

    @RequestMapping("/")
    public String index(Model model) {
        model.addAttribute("name", "nate");
        return "index";
    }

    @RequestMapping("/login")
    public String login() {
        return "login.html";
    }
}
