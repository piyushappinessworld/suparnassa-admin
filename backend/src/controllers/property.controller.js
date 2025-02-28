
const Property = require('../models/property.model');

// Create property
exports.createProperty = async (req, res) => {
  try {
    const { name, location, type, details } = req.body;
    const images = req.files.map(file => file.location);

    const property = await Property.create({
      name,
      location,
      type,
      details,
      images,
      createdBy: req.user.id
    });

    res.status(201).json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all properties
exports.getProperties = async (req, res) => {
  try {
    const properties = await Property.find()
      .sort({ createdAt: -1 })
      .populate('createdBy', 'email');
    
    res.json(properties);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single property
exports.getProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id)
      .populate('createdBy', 'email');
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Update property
exports.updateProperty = async (req, res) => {
  try {
    const { name, location, type, details } = req.body;
    let property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updateData = {
      name,
      location,
      type,
      details
    };

    // Add new images if uploaded
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(file => file.location);
      updateData.images = [...property.images, ...newImages];
    }

    property = await Property.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(property);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete property
exports.deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Check ownership
    if (property.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await property.remove();

    res.json({ message: 'Property removed' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
