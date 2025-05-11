package com.connorevans.potato.controller;

import com.connorevans.potato.entity.PotatoItem;
import com.connorevans.potato.service.PotatoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.Optional;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PotatoController.class)
class PotatoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private PotatoService potatoService;

    private PotatoItem potato1;
    private PotatoItem potato2;

    @BeforeEach
    void setUp() {
        potato1 = new PotatoItem("Connor", 40d, 50d, 1.50, "Junior");
        potato2 = new PotatoItem("Dan",    60d, 40d, 1.50, "Senior");
        potato1.setId(1L);
        potato2.setId(2L);

    }

    @Test
    void shouldCreatePotatoItem() throws Exception {
        when(potatoService.create(any(PotatoItem.class))).thenReturn(potato1);

        mockMvc.perform(post("/potatoes")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(potato1)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1));
    }

    @Test
    void shouldGetAllPotatoes() throws Exception {
        when(potatoService.getAllPotatoes()).thenReturn(List.of(potato1, potato2));

        mockMvc.perform(get("/potatoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));
    }

    @Test
    void shouldGetPotatoById() throws Exception {
        when(potatoService.getPotatoItemById(1L)).thenReturn(Optional.of(potato1));

        mockMvc.perform(get("/potatoes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Connor"));
    }

    @Test
    void shouldUpdatePotatoById() throws Exception {
        PotatoItem updated = new PotatoItem("Connor", 50d, 60d, 1.75, "Junior");
        updated.setId(1L);

        when(potatoService.updatePotatoItemById(eq(1L), any(PotatoItem.class)))
                .thenReturn(updated);

        mockMvc.perform(put("/potatoes/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updated)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.hourlyPay").value(50d));
    }

    @Test
    void shouldDeletePotatoById() throws Exception {
        mockMvc.perform(delete("/potatoes/1"))
                .andExpect(status().isNoContent());

        verify(potatoService).deletePotatoItemById(1L);
    }
}
