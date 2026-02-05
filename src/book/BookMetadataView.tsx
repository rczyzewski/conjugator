import { JSX } from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Stack from "react-bootstrap/Stack";
import Image from "react-bootstrap/Image";
import type { BookMetadata } from "./bookModel";

function SectionBadges({
  label,
  items,
  variant,
}: {
  readonly label: string;
  readonly items: readonly string[] | undefined;
  readonly variant: string;
}): JSX.Element | null {
  if (!items || items.length === 0) return null;
  return (
    <div>
      <div className="text-muted small mb-1">{label}</div>
      <Stack direction="horizontal" gap={2} className="flex-wrap">
        {items.map((t) => (
          <Badge key={`${label}-${t}`} bg={variant}>
            {t}
          </Badge>
        ))}
      </Stack>
    </div>
  );
}

export default function BookMetadataView({
  metadata,
}: {
  readonly metadata?: BookMetadata;
}): JSX.Element {
  if (!metadata) {
    return (
      <Card className="border m-2" style={{ backgroundColor: "#FAFAFA" }}>
        <Card.Body>
          <div className="text-muted">No metadata.</div>
        </Card.Body>
      </Card>
    );
  }

  const resolvePublicUrl = (maybePath: string | undefined): string | undefined => {
    if (!maybePath) return undefined;
    if (maybePath.startsWith("http://") || maybePath.startsWith("https://") || maybePath.startsWith("data:")) {
      return maybePath;
    }
    const base = import.meta.env.BASE_URL ?? "/";
    const normalizedBase = base.endsWith("/") ? base.slice(0, -1) : base;
    const cleaned = maybePath.startsWith("/") ? maybePath.slice(1) : maybePath;
    return `${normalizedBase}/${cleaned}`;
  };

  return (
    <Card className="border m-2" style={{ backgroundColor: "#FAFAFA" }}>
      <Card.Body>
        <Row className="align-items-start g-3">
          {metadata.image && (
            <Col className="col-auto">
              <Image
                src={resolvePublicUrl(metadata.image)}
                rounded
                style={{ width: 120, height: 68, objectFit: "cover" }}
              />
            </Col>
          )}
          <Col>
            <Card.Title className="mb-1">{metadata.title}</Card.Title>
            <div className="text-muted">
              {metadata.author}
              {metadata.level ? ` • ${metadata.level}` : ""}
            </div>
          </Col>
          <Col className="col-auto">
            {metadata.file && <Badge bg="secondary">{metadata.file}</Badge>}
          </Col>
        </Row>

        {metadata.description && (
          <Card.Text className="mt-3 mb-3">{metadata.description}</Card.Text>
        )}

        <Row className="g-3">
          <Col md={6}>
            <SectionBadges label="Categories" items={metadata.category} variant="info" />
          </Col>
          <Col md={6}>
            <SectionBadges label="Tags" items={metadata.tags} variant="dark" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
}


