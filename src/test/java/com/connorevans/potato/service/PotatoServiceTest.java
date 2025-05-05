package com.connorevans.potato.service;

import com.connorevans.potato.entity.PotatoItem;
import com.connorevans.potato.repo.PotatoItemRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class PotatoServiceTest {

    @Mock
    private PotatoItemRepository potatoItemRepository;

    @InjectMocks
    private PotatoService potatoService;

    private PotatoItem potatoItem1;
    private PotatoItem potatoItem2;


@BeforeEach
void setUp() {
    potatoItem1 = new PotatoItem("Connor", 40d, 50d, 1.50);
    potatoItem1.setId(1L);
    potatoItem2 = new PotatoItem("Dan", 60d, 40d, 1.50);
    potatoItem2.setId(2L);
    }

    // POST (CREATE)
    @Test
    void savesPotatoItem(){
        //arrange
        when(potatoItemRepository.save(potatoItem1)).thenReturn(potatoItem1);

        //act
        PotatoItem result = potatoService.create(potatoItem1);

        //assert
        assertThat(result).isSameAs(potatoItem1);
        verify(potatoItemRepository).save(potatoItem1);
    }

    // GET #1 (READ)
    @Test
    void getAllPotatoItems_returnsAllPotatoes() {
        //arrange
        when(potatoItemRepository.findAll()).thenReturn(List.of(potatoItem1, potatoItem2));

        //act
        List<PotatoItem> result = potatoService.getAllPotatoes();

        //assert
        assertThat(result).containsExactlyInAnyOrder(potatoItem1, potatoItem2);
        verify(potatoItemRepository).findAll();
    }

    // GET (BY ID) #2 (READ)
    @Test
    void getPotatoItemByID_returnsCorrectPotatoItem(){
        //arrange
        when(potatoItemRepository.findById(1L)).thenReturn(Optional.of(potatoItem1));

        //act
        Optional<PotatoItem> result = potatoService.getPotatoItemById(1L);

        //assert
        assertThat(result).isPresent().contains(potatoItem1);
        verify(potatoItemRepository).findById(1L);
    }

    // PUT (UPDATE)
    @Test
    void canUpdatePotatoItemUsingID() {
    // arrange
    PotatoItem updatedItem = new PotatoItem("Connor", 50d, 60, 1.75);
    updatedItem.setId(1L);

    when(potatoItemRepository.findById(1L)).thenReturn(Optional.of(potatoItem1));
    when(potatoItemRepository.save(any(PotatoItem.class))).thenReturn(updatedItem);

    // act
    PotatoItem result = potatoService.updatePotatoItemById(1L, updatedItem);

    //assert
    assertThat(result.getHourlyPay()).isEqualTo(50d);
    assertThat(result.getHoursPerWeek()).isEqualTo(60d);
    verify(potatoItemRepository).findById(1L);
    verify(potatoItemRepository).save(any(PotatoItem.class));
    }

    // DELETE
    @Test
    void DeletePotatoItemById() {
    // act
    potatoService.deletePotatoItemById(1L);

    // assert
    verify(potatoItemRepository).deleteById(1L);

    }

}
