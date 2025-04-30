package com.connorevans.potato.repo;

import com.connorevans.potato.entity.PotatoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PotatoItemRepository extends JpaRepository<PotatoItem, Long> {
}
