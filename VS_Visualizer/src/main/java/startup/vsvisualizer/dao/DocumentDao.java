package startup.vsvisualizer.dao;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import startup.vsvisualizer.entity.Document;

@Repository
public interface DocumentDao extends CrudRepository<Document, Integer> {
}
